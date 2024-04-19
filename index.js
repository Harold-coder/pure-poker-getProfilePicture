// Import the AWS SDK and other required modules
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Lambda handler function
exports.handler = async (event) => {
    const profile_pic_link = event.profile_pic_link; // Assuming the user data comes in the event object
    const requestOrigin = event.headers ? event.headers.origin : "*";

    if (!profile_pic_link) {
        // If no user or profile link is available, return a default image
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": requestOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({imageUrl: "URL to your default image here"})
        };
    }

    // Set up the parameters for the S3 getObject call
    const params = {
        Bucket: 'pure-poker-profile-pics',
        Key: profile_pic_link
    };

    try {
        // Attempt to retrieve the image from S3
        const data = await s3.getObject(params).promise();

        // Create a blob URL from the retrieved image data
        const objectURL = `data:${data.ContentType};base64,${data.Body.toString('base64')}`;

        // Return the image URL in the response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": requestOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({imageUrl: objectURL})
        };
    } catch (err) {
        console.error('Error retrieving image:', err);
        // Return an error response
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": requestOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({error: 'Failed to retrieve image'})
        };
    }
};
