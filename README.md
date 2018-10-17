# ZenJiraSync
This script will pull all the Organizations in Zendesk and add them as field options to a customfield in Jira

# Jira set up
Requirements:
* [Jira Customfield Editor Plugin](https://marketplace.atlassian.com/apps/1212096/customfield-editor-plugin)

Once installed make sure you list the field you want to edit and create a context for it on the [Customfield Editor Plugin settings](https://your.jira.url/secure/CustomFieldEditorPlugin-UserListCustomField.jspa)

## jira-config.json
Copy `src/config/jira-config.json.template` into `src/config/jira-config.json` and fill in the following settings:
```json
{
    "hostname": "your.jira.url",
    "username": "user",
    "password": "password",
    "customerField": {
        "id": 0000000,
        "context": 00000000
    }
}
```

# Zendesk set up
Copy `src/config/zendesk-config.json.template` into `src/config/zendesk-config.json` and fill in the following settings:
## zendesk-config.json
```json
{
    "username": "user",
    "token": "password",
    "ignoreOrgs": ["Companies", "to", "ignore"],
    "host": "company.zendesk.com"
}
```