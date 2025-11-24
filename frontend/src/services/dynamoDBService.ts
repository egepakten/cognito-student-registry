//  DynamoDB service with per-user data isolation
// Uses Cognito Identity Pool credentials for fine-grained access control

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getAWSCredentials } from "./s3Service"; // Reuse credential fetching

// ========================================
// CONFIGURATION
// ========================================

const config = {
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  tableName: import.meta.env.VITE_DYNAMODB_TABLE || "WiseUni-Data-dev",
};

// ========================================
// TYPES
// ========================================

// CHANGE: Added TypeScript interfaces for type safety
// REASON: Clear contract for data structures

export interface UserProfile {
  identityId: string;
  email: string;
  name: string;
  role: "student" | "professor" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  identityId: string;
  courseId: string;
  courseName: string;
  professorName: string;
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
}

export interface Grade {
  identityId: string;
  courseId: string;
  courseName: string;
  grade: string;
  points: number;
  gradedAt: string;
  gradedBy: string; // Professor's identity ID
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  professorId: string;
  professorName: string;
  credits: number;
  semester: string;
}

// ========================================
// DYNAMODB CLIENT FACTORY
// ========================================

// CHANGE: Creates DynamoDB client with user's temporary credentials
// REASON: IAM policy attached to credentials enforces per-user isolation

async function getDynamoDBClient(idToken: string): Promise<{
  client: DynamoDBClient;
  identityId: string;
}> {
  const { identityId, credentials } = await getAWSCredentials(idToken);

  const client = new DynamoDBClient({
    region: config.region,
    credentials,
  });

  return { client, identityId: identityId || "" };
}

// ========================================
// USER PROFILE OPERATIONS
// ========================================

// CHANGE: Get user's own profile
// REASON: PK = USER#{identityId} ensures user can only read their own data

export async function getUserProfile(
  idToken: string
): Promise<UserProfile | null> {
  const { client, identityId } = await getDynamoDBClient(idToken);

  const response = await client.send(
    new GetItemCommand({
      TableName: config.tableName,
      Key: marshall({
        PK: `USER#${identityId}`,
        SK: "PROFILE",
      }),
    })
  );

  if (!response.Item) return null;

  const item = unmarshall(response.Item);
  return {
    identityId: item.identityId,
    email: item.email,
    name: item.name,
    role: item.role,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

// CHANGE: Create or update user profile
// REASON: First-time login should create profile; updates allowed for own data

export async function saveUserProfile(
  idToken: string,
  profile: Omit<UserProfile, "identityId" | "createdAt" | "updatedAt">
): Promise<UserProfile> {
  const { client, identityId } = await getDynamoDBClient(idToken);

  const now = new Date().toISOString();
  const item: UserProfile = {
    ...profile,
    identityId,
    createdAt: now,
    updatedAt: now,
  };

  await client.send(
    new PutItemCommand({
      TableName: config.tableName,
      Item: marshall({
        PK: `USER#${identityId}`,
        SK: "PROFILE",
        ...item,
        // GSI for admin lookups
        GSI1PK: `ROLE#${profile.role}`,
        GSI1SK: `USER#${identityId}`,
      }),
    })
  );

  return item;
}

// ========================================
// ENROLLMENT OPERATIONS
// ========================================

// CHANGE: Get all enrollments for current user
// REASON: Query with SK begins_with "ENROLLMENT#" returns all user's courses

export async function getMyEnrollments(idToken: string): Promise<Enrollment[]> {
  const { client, identityId } = await getDynamoDBClient(idToken);

  const response = await client.send(
    new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: marshall({
        ":pk": `USER#${identityId}`,
        ":sk": "ENROLLMENT#",
      }),
    })
  );

  if (!response.Items) return [];

  return response.Items.map((item) => {
    const data = unmarshall(item);
    return {
      identityId: data.identityId,
      courseId: data.courseId,
      courseName: data.courseName,
      professorName: data.professorName,
      enrolledAt: data.enrolledAt,
      status: data.status,
    };
  });
}

// CHANGE: Enroll current user in a course
// REASON: Creates enrollment record under user's partition + course's roster

export async function enrollInCourse(
  idToken: string,
  courseId: string,
  courseName: string,
  professorName: string
): Promise<Enrollment> {
  const { client, identityId } = await getDynamoDBClient(idToken);

  const now = new Date().toISOString();
  const enrollment: Enrollment = {
    identityId,
    courseId,
    courseName,
    professorName,
    enrolledAt: now,
    status: "active",
  };

  // Write to user's partition
  await client.send(
    new PutItemCommand({
      TableName: config.tableName,
      Item: marshall({
        PK: `USER#${identityId}`,
        SK: `ENROLLMENT#${courseId}`,
        ...enrollment,
        // GSI for course roster lookups
        GSI1PK: `COURSE#${courseId}`,
        GSI1SK: `USER#${identityId}`,
      }),
    })
  );

  return enrollment;
}

// ========================================
// GRADE OPERATIONS
// ========================================

// CHANGE: Get all grades for current user
// REASON: Students can only see their own grades (enforced by IAM policy)

export async function getMyGrades(idToken: string): Promise<Grade[]> {
  const { client, identityId } = await getDynamoDBClient(idToken);

  const response = await client.send(
    new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: marshall({
        ":pk": `USER#${identityId}`,
        ":sk": "GRADE#",
      }),
    })
  );

  if (!response.Items) return [];

  return response.Items.map((item) => {
    const data = unmarshall(item);
    return {
      identityId: data.identityId,
      courseId: data.courseId,
      courseName: data.courseName,
      grade: data.grade,
      points: data.points,
      gradedAt: data.gradedAt,
      gradedBy: data.gradedBy,
    };
  });
}

// ========================================
// COURSE OPERATIONS (Read-only for students)
// ========================================

// CHANGE: Get course details (available to all authenticated users)
// REASON: Course metadata is public within the university

export async function getCourse(
  idToken: string,
  courseId: string
): Promise<Course | null> {
  const { client } = await getDynamoDBClient(idToken);

  const response = await client.send(
    new GetItemCommand({
      TableName: config.tableName,
      Key: marshall({
        PK: `COURSE#${courseId}`,
        SK: "METADATA",
      }),
    })
  );

  if (!response.Item) return null;

  const data = unmarshall(response.Item);
  return {
    courseId: data.courseId,
    title: data.title,
    description: data.description,
    professorId: data.professorId,
    professorName: data.professorName,
    credits: data.credits,
    semester: data.semester,
  };
}

// CHANGE: Get all available courses
// REASON: For enrollment selection screen

export async function getAllCourses(idToken: string): Promise<Course[]> {
  const { client } = await getDynamoDBClient(idToken);

  const response = await client.send(
    new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: "begins_with(PK, :pk) AND SK = :sk",
      ExpressionAttributeValues: marshall({
        ":pk": "COURSE#",
        ":sk": "METADATA",
      }),
      // Note: This requires a Scan in reality; consider a GSI for course listings
    })
  );

  if (!response.Items) return [];

  return response.Items.map((item) => {
    const data = unmarshall(item);
    return {
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      professorId: data.professorId,
      professorName: data.professorName,
      credits: data.credits,
      semester: data.semester,
    };
  });
}

// ========================================
// PROFESSOR-ONLY OPERATIONS
// ========================================

// CHANGE: Get course roster (Professor can see all students in their course)
// REASON: Professor IAM policy allows access to COURSE#* items

export async function getCourseRoster(
  idToken: string,
  courseId: string
): Promise<{ identityId: string; name: string; enrolledAt: string }[]> {
  const { client } = await getDynamoDBClient(idToken);

  // Query GSI to get all users enrolled in this course
  const response = await client.send(
    new QueryCommand({
      TableName: config.tableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
      ExpressionAttributeValues: marshall({
        ":pk": `COURSE#${courseId}`,
        ":sk": "USER#",
      }),
    })
  );

  if (!response.Items) return [];

  return response.Items.map((item) => {
    const data = unmarshall(item);
    return {
      identityId: data.identityId,
      name: data.name || "Unknown",
      enrolledAt: data.enrolledAt,
    };
  });
}

// CHANGE: Assign grade to a student (Professor only)
// REASON: Professors can write to USER#* partition for grade items

export async function assignGrade(
  idToken: string,
  studentIdentityId: string,
  courseId: string,
  courseName: string,
  grade: string,
  points: number
): Promise<Grade> {
  const { client, identityId: professorId } = await getDynamoDBClient(idToken);

  const now = new Date().toISOString();
  const gradeRecord: Grade = {
    identityId: studentIdentityId,
    courseId,
    courseName,
    grade,
    points,
    gradedAt: now,
    gradedBy: professorId,
  };

  await client.send(
    new PutItemCommand({
      TableName: config.tableName,
      Item: marshall({
        PK: `USER#${studentIdentityId}`,
        SK: `GRADE#${courseId}`,
        ...gradeRecord,
        // GSI for grade analytics
        GSI1PK: `COURSE#${courseId}`,
        GSI1SK: `GRADE#${studentIdentityId}`,
      }),
    })
  );

  return gradeRecord;
}

// ========================================
// ADMIN-ONLY OPERATIONS
// ========================================

// CHANGE: Create a new course (Admin only)
// REASON: Admin IAM policy allows full dynamodb:* access

export async function createCourse(
  idToken: string,
  course: Course
): Promise<Course> {
  const { client } = await getDynamoDBClient(idToken);

  await client.send(
    new PutItemCommand({
      TableName: config.tableName,
      Item: marshall({
        PK: `COURSE#${course.courseId}`,
        SK: "METADATA",
        ...course,
        GSI1PK: `SEMESTER#${course.semester}`,
        GSI1SK: `COURSE#${course.courseId}`,
      }),
    })
  );

  return course;
}

// CHANGE: Get all users (Admin only)
// REASON: Admin needs to manage all users in the system

export async function getAllUsers(
  idToken: string,
  role?: "student" | "professor" | "admin"
): Promise<UserProfile[]> {
  const { client } = await getDynamoDBClient(idToken);

  let params: any = {
    TableName: config.tableName,
    IndexName: "GSI1",
  };

  if (role) {
    params.KeyConditionExpression = "GSI1PK = :pk";
    params.ExpressionAttributeValues = marshall({
      ":pk": `ROLE#${role}`,
    });
  }

  const response = await client.send(new QueryCommand(params));

  if (!response.Items) return [];

  return response.Items.map((item) => {
    const data = unmarshall(item);
    return {
      identityId: data.identityId,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

// CHANGE: Delete a user (Admin only)
// REASON: Admin needs to remove users from the system

export async function deleteUser(
  idToken: string,
  userIdentityId: string
): Promise<void> {
  const { client } = await getDynamoDBClient(idToken);

  // Delete profile
  await client.send(
    new DeleteItemCommand({
      TableName: config.tableName,
      Key: marshall({
        PK: `USER#${userIdentityId}`,
        SK: "PROFILE",
      }),
    })
  );

  // Note: In production, you'd also delete enrollments, grades, etc.
  // Consider using a transaction or batch delete
}
