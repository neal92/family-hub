export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext) {
    const prettyContext = JSON.stringify(context, null, 2);
    super(
      `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${prettyContext}`
    );
    this.name = 'FirestorePermissionError';
    // This is to make the error message more readable in the console.
    // The stack trace is not very useful in this case.
    this.stack = '';
  }
}
