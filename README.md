# Bulk Skill Casting on Habitica via Google Apps Script

This Google Apps Script automates the process of casting multiple skills in [Habitica](https://habitica.com/) whenever a specific custom reward is purchased. Enhance your Habitica experience by streamlining repetitive actions and automating in-game behaviors.

## Table of Contents

- [Bulk Skill Casting on Habitica via Google Apps Script](#bulk-skill-casting-on-habitica-via-google-apps-script)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [Create the Google Apps Script](#create-the-google-apps-script)
    - [Configure Script Properties](#configure-script-properties)
    - [Set Up Habitica Webhook](#set-up-habitica-webhook)
  - [Configuration Details](#configuration-details)
    - [Obtaining USER\_ID and API\_TOKEN](#obtaining-user_id-and-api_token)
    - [Customizing SKILL\_IDS](#customizing-skill_ids)
    - [Finding SPECIFIC\_REWARD\_ID and SPECIFIC\_REWARD\_TEXT](#finding-specific_reward_id-and-specific_reward_text)
  - [Usage Notes](#usage-notes)

## Prerequisites

- A **Google account** to access Google Apps Script.
- A **Habitica account** to interact with the Habitica API.
- Basic knowledge of Habitica's skill system and API usage.

## Setup Instructions

### Create the Google Apps Script

1. **Create a New Google Apps Script Project:**

   - Go to [script.google.com](https://script.google.com/) and create a new project.

2. **Copy the Script Code:**

   - Replace the default code in the script editor with the Code.gs code from this repository.
  
### Configure Script Properties

The script uses Script Properties to store configuration data securely.

1. **Set Script Properties:**

   In the script editor, set the following values in the `setScriptProperties` function:

   - **SKILL_IDS:** A JSON string of skill objects to be cast.
   - **SPECIFIC_REWARD_ID:** The ID of the custom reward that triggers the script.
   - **SPECIFIC_REWARD_TEXT:** The text of the custom reward.
   - **USER_ID:** Your Habitica User ID.
   - **API_TOKEN:** Your Habitica API Token.

    **Example:**

    ```json
    SKILL_IDS: [
    { "id": "skill-id-1" },
    { "id": "skill-id-2", "target": "target-user-id" }
    ]
    SPECIFIC_REWARD_ID: "your-custom-reward-id"
    SPECIFIC_REWARD_TEXT: "Your Custom Reward"
    USER_ID: "your-habitica-user-id"
    API_TOKEN: "your-habitica-api-token"
    ```

2. **Select the setScriptProperties Function:**

    At the top toolbar of the Apps Script editor, you'll see a dropdown menu to `Select function to run`.
    
    Click on the dropdown and select `setScriptProperties` from the list.

3. **Run the Function**

    With `setScriptProperties` selected, click the `Run` button (▶️) next to the dropdown.

4. **Authorize the Script**

    The first time you run the script, you'll be prompted to authorize it.
    A dialog will appear: "Authorization required".
    Click Review permissions.
    Sign in with your Google account if prompted.
    You may see a warning that the app isn't verified (since it's your own script).
    Click Advanced.
    Click Go to {Your Script Name} (unsafe).
    Review the permissions and click Allow.


5. **Save the Project:**

   - Click on the floppy disk icon or press `Ctrl+S` to save your script.

6. **Deploy the Script as a Web App:**

   - Click on `Deploy` > `New deployment`.
   - Select `Web app`.
   - **Execute as:** Choose `Me (your email)`.
   - **Who has access:** Select `Anyone`.
   - Click `Deploy`.
   - Copy the **Web App URL** provided after deployment; you'll need it for the webhook setup.
  
### Set Up Habitica Webhook

To trigger the script when the custom reward is purchased, set up a webhook in Habitica.

1. **Navigate to Webhooks Settings:**

   - Log in to Habitica.
   - Go to `User Icon` > `Settings` > `Site Data` tab.

2. **Create a New Webhook:**

   - **URL:** Enter the **Web App URL** of your deployed Google Apps Script.
   - **Enabled:** Check the box to enable the webhook.
   - Save the webhook.

## Configuration Details

### Obtaining USER_ID and API_TOKEN

1. **Access API Settings:**

   - Log in to Habitica.
   - Go to `User Icon` > `Settings` > `Site Data`.

2. **Copy Credentials:**

   - **User ID:** Copy your User ID.
   - **API Token:** Copy your API Token.

3. **Add to Script Properties:**

   - Paste these values into the `USER_ID` and `API_TOKEN` fields in your Script Properties.

### Customizing SKILL_IDS

- **id:** The ID of the skill to cast (e.g., `"toolsOfTrade"`).
- **target (optional):** The Task ID of the target if the skill affects another user.

**Example:**

```json
[
  { "id": "toolsOfTrade" },
  { "id": "backStab", "target": "target-task-id" }
]
```

### Finding SPECIFIC_REWARD_ID and SPECIFIC_REWARD_TEXT

1. **Create a Custom Reward in Habitica:**

   - Go to your tasks and add a new reward with a unique name.

2. **Find the Reward ID:**

   - Use the Habitica API or a tool like [Habitica User Data Display Tool](https://tools.habitica.com) to get the ID of your custom reward.

3. **Add to Script Properties:**

   - Set `SPECIFIC_REWARD_ID` and `SPECIFIC_REWARD_TEXT` in your Script Properties to match your custom reward.

## Usage Notes

- **Security:** Keep your `USER_ID` and `API_TOKEN` confidential. Do not share or publish them.
- **Limitations/Bugs:** This is an open source project. If you find any bugs or have suggestions for improvements, please create an issue on GitHub.

