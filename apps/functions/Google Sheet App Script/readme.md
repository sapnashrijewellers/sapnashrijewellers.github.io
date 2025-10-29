Now you can edit your .gs files directly in VS Code.

Action	VS Code Command	Apps Script Equivalent
Push Local Changes	clasp push	Clicking the Save icon in the web editor.
Pull Remote Changes	clasp pull	Refreshing the web editor (rarely needed).
Deploy a New Version	clasp deploy	Going to Deploy > New Deployment in the web editor.

Export to Sheets


To deploy new version in existing deployment id

```clasp deploy -i <YOUR_EXISTING_DEPLOYMENT_ID> --description "Fixed image splitting and deployed final ticker logic"```