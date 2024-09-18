function setScriptProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    SKILL_IDS: JSON.stringify([
      { "id": "skill-id-1" },
      { "id": "skill-id-2", "target": "target-user-id" }
    ]),
    SPECIFIC_REWARD_ID: "your-custom-reward-id",
    SPECIFIC_REWARD_TEXT: "Your Custom Reward"
    USER_ID: "your-habitica-user-id"
    API_TOKEN: "your-habitica-api-token"
  });
}

function doPost(e) {
  // Log that the script has been triggered
  Logger.log('Script triggered');

  // Load environment variables from Script Properties with error handling
  var scriptProperties = PropertiesService.getScriptProperties();

  var skillIdsProperty = scriptProperties.getProperty('SKILL_IDS');
  if (!skillIdsProperty) throw new Error('SKILL_IDS is not defined in Script Properties.');
  var skillObjects;
  try {
    skillObjects = JSON.parse(skillIdsProperty);
  } catch (error) {
    throw new Error('SKILL_IDS is not a valid JSON string.');
  }

  var specificRewardId = scriptProperties.getProperty('SPECIFIC_REWARD_ID');
  if (!specificRewardId) throw new Error('SPECIFIC_REWARD_ID is not defined.');

  var specificRewardText = scriptProperties.getProperty('SPECIFIC_REWARD_TEXT');
  if (!specificRewardText) throw new Error('SPECIFIC_REWARD_TEXT is not defined.');

  var userId = scriptProperties.getProperty('USER_ID');
  if (!userId) throw new Error('USER_ID is not defined.');

  var apiToken = scriptProperties.getProperty('API_TOKEN');
  if (!apiToken) throw new Error('API_TOKEN is not defined.');

  // Check if the POST data exists
  if (!e.postData || !e.postData.contents) {
    Logger.log('No post data received');
    return ContentService.createTextOutput(JSON.stringify({ status: 'no data received' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Parse the JSON data from Habitica
  var data;
  try {
    data = JSON.parse(e.postData.contents);
    Logger.log('Received data: ' + JSON.stringify(data));
  } catch (error) {
    Logger.log('Error parsing JSON: ' + error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Verify that the data is the expected webhook event
  if (data.type === 'scored' && data.task && data.task.type === 'reward') {
    var task = data.task;

    // Check if the purchased reward matches your specific reward
    if (task.id === specificRewardId || task.text === specificRewardText) {
      Logger.log('Specific reward purchased: ' + task.text);
      bulkCastSkills(userId, apiToken, skillObjects);
    } else {
      Logger.log('Different reward purchased: ' + task.text);
    }
  } else {
    Logger.log('Event is not a reward purchase or has unexpected format');
  }

  // Return a success response
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function bulkCastSkills(userId, apiToken, skillObjects) {
  // Base URL for casting skills
  var baseUrl = 'https://habitica.com/api/v3/user/class/cast/';
Logger.log(skillObjects);
  // Headers for authentication
  var headers = {
    'x-client' : 'eef575f7-d8ac-4707-ad41-6ee9b96b681' + ' - ' + 'Habitica Custom Reward Trigger',
    'x-api-user': userId,
    'x-api-key': apiToken,
    'Content-Type': 'application/json'
  };

  // Check if skillObjects is an array and not empty
  if (!Array.isArray(skillObjects) || skillObjects.length === 0) {
    Logger.log('No skill IDs provided to cast.');
    return;
  }

  // Iterate over the skill objects and cast each one
  skillObjects.forEach(function(skill) {
    try {
      // Construct the endpoint URL for the skill
      var url = baseUrl + encodeURIComponent(skill.id);

      // Prepare the options for UrlFetchApp.fetch
      var options = {
        method: 'post',
        headers: headers,
        muteHttpExceptions: true // To handle errors gracefully
      };

      // If the skill requires a target, add the targetId to the payload
      if (skill.target) {
        options.payload = JSON.stringify({ targetId: skill.target });
      }
      Logger.log(url);
      Logger.log(options);
      // Make the API request to cast the skill
      var response = UrlFetchApp.fetch(url, options);

      // Parse the response
      var result = JSON.parse(response.getContentText());

      if (result.success) {
        Logger.log('Successfully cast skill: ' + skill.id);
      } else {
        Logger.log('Failed to cast skill: ' + skill.id + '. Error: ' + result.message);
      }
    } catch (error) {
      Logger.log('Error casting skill: ' + skill.id + '. Exception: ' + error);
    }
  });
}

function testDoPost() {
  // Create a simulated event object 'e'
  var e = {
    postData: {
      contents: JSON.stringify({
        type: 'scored',
        task: {
          id: 'f1463b2c-5ae2-4fce-b59d-c64e3a340111', // Ensure this matches your SPECIFIC_REWARD_ID
          text: 'Test', // Ensure this matches your SPECIFIC_REWARD_TEXT
          type: 'reward'
        }
      }),
      length: 0,
      type: 'application/json',
      name: 'postData'
    }
  };

  // Call the doPost function with the simulated event
  var response = doPost(e);

  // Log the response
  Logger.log('Response: ' + response.getContent());
}
