export async function fetchBookCoverImage(bookId) {
  const response = await fetch(
    `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/books/${bookId}/coverImage`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch cover image: ${response.statusText}`);
  }

  const data = await response.json(); // or blob/URL depending on your Lambda response
  return data; // e.g., base64, signedUrl, or direct S3 URL
}
