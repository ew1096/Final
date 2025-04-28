import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const result = await dynamo.scan({
            TableName: TABLE_NAME
        });

        console.log('DynamoDB result:', result); // Log the result for debugging

        if (!result.Items || result.Items.length === 0) {
            console.log('No tasks found.');
            body = JSON.stringify([]); // Return an empty array if no tasks
        } else {
            body = JSON.stringify(result.Items); 
        }

    } catch (err) {
        console.error(err);
        statusCode = 400;
        body = JSON.stringify({ message: err.message });
    }

    return {
        statusCode,
        headers,
        body
    };
};
