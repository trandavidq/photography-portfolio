import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Gallery, Image, AuthSession } from '../types';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const GALLERIES_TABLE = process.env.DYNAMODB_GALLERIES_TABLE || 'galleries';
const IMAGES_TABLE = process.env.DYNAMODB_IMAGES_TABLE || 'images';
const AUTH_SESSIONS_TABLE = process.env.DYNAMODB_AUTH_SESSIONS_TABLE || 'auth-sessions';

// ============ Gallery Operations ============

export async function createGallery(data: Omit<Gallery, 'createdAt' | 'updatedAt'>): Promise<Gallery> {
  const now = new Date().toISOString();
  const gallery: Gallery = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: GALLERIES_TABLE,
      Item: gallery,
    })
  );

  return gallery;
}

export async function getGallery(id: string): Promise<Gallery | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: GALLERIES_TABLE,
      Key: { id },
    })
  );

  return (result.Item as Gallery) || null;
}

export async function getAllGalleries(): Promise<Gallery[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: GALLERIES_TABLE,
    })
  );

  const galleries = (result.Items as Gallery[]) || [];

  // Sort by year descending, then by sortOrder
  return galleries.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    return a.sortOrder - b.sortOrder;
  });
}

export async function updateGallery(
  id: string,
  updates: Partial<Omit<Gallery, 'id' | 'createdAt'>>
): Promise<Gallery | null> {
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  // Add updatedAt timestamp
  const updatesWithTimestamp = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  Object.entries(updatesWithTimestamp).forEach(([key, value], index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpressionParts.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = value;
  });

  const result = await docClient.send(
    new UpdateCommand({
      TableName: GALLERIES_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as Gallery) || null;
}

export async function deleteGallery(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: GALLERIES_TABLE,
      Key: { id },
    })
  );
}

// ============ Image Operations ============

export async function createImage(data: Omit<Image, 'createdAt'>): Promise<Image> {
  const image: Image = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: IMAGES_TABLE,
      Item: image,
    })
  );

  return image;
}

export async function getImage(id: string): Promise<Image | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: IMAGES_TABLE,
      Key: { id },
    })
  );

  return (result.Item as Image) || null;
}

export async function getImagesByGallery(galleryId: string): Promise<Image[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: IMAGES_TABLE,
      IndexName: 'galleryId-sortOrder-index',
      KeyConditionExpression: 'galleryId = :galleryId',
      ExpressionAttributeValues: {
        ':galleryId': galleryId,
      },
    })
  );

  return (result.Items as Image[]) || [];
}

export async function updateImage(
  id: string,
  updates: Partial<Omit<Image, 'id' | 'createdAt'>>
): Promise<Image | null> {
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value], index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpressionParts.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = value;
  });

  const result = await docClient.send(
    new UpdateCommand({
      TableName: IMAGES_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as Image) || null;
}

export async function deleteImage(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: IMAGES_TABLE,
      Key: { id },
    })
  );
}

export async function deleteImagesByGallery(galleryId: string): Promise<void> {
  const images = await getImagesByGallery(galleryId);

  await Promise.all(
    images.map((image) =>
      docClient.send(
        new DeleteCommand({
          TableName: IMAGES_TABLE,
          Key: { id: image.id },
        })
      )
    )
  );
}

// ============ Auth Session Operations ============

export async function createAuthSession(
  email: string,
  code: string,
  expiresAt: number
): Promise<AuthSession> {
  const session: AuthSession = {
    email,
    code, // Should be hashed before calling this function
    attempts: 0,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  await docClient.send(
    new PutCommand({
      TableName: AUTH_SESSIONS_TABLE,
      Item: session,
    })
  );

  return session;
}

export async function getAuthSession(email: string): Promise<AuthSession | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: AUTH_SESSIONS_TABLE,
      Key: { email },
    })
  );

  return (result.Item as AuthSession) || null;
}

export async function incrementAuthAttempts(email: string): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: AUTH_SESSIONS_TABLE,
      Key: { email },
      UpdateExpression: 'SET attempts = attempts + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    })
  );
}

export async function deleteAuthSession(email: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: AUTH_SESSIONS_TABLE,
      Key: { email },
    })
  );
}
