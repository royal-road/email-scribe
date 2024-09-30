type EmailScribeDataRetriever = () => {
  subject: string;
  id: string;
  plainText: string;
  html: string;
  preset: string;
};

// Declare the global variable
declare global {
  interface Window {
    emailScribeDataRetrievers: {
      [key: string]: EmailScribeDataRetriever;
    };
  }
}

// Initialize the global variable
window.emailScribeDataRetrievers = {};

// Export a helper function to get email data
export function getEmailData(editorId: string) {
  if (
    window.emailScribeDataRetrievers &&
    window.emailScribeDataRetrievers[editorId]
  ) {
    return window.emailScribeDataRetrievers[editorId]();
  }
  console.warn(`No email data retriever found for editor with id: ${editorId}`);
  return null;
}
