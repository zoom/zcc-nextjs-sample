# Create a Zoom App app with the App Manifest API

This guide shows how to create a Zoom App app using the **App Manifest API**.

Since HTML buttons with inline `onclick` events won't render properly on platforms like GitHub or markdown-based documentation, it's best to use a **styled markdown link** instead. Here's an effective alternative that clearly invites users to click, using bold text and emojis for visibility:

---

### 1. Create an OAuth app

👉 **[Click here to create an app on the Zoom App Marketplace](https://marketplace.zoom.us/develop/create)**

* Select **General app** and click **Create**.

> [!NOTE]
> Take note of your app ID in the URL after app creation -- you will need it to later on.

### 2. Retrieve app credentials

* Click **Manage** > your app
* Navigate to **Basic Information** > **App Credentials**

> [!Note]
> Use these credentials for [authorization](https://developers.zoom.us/docs/integrations/oauth/).

### 3. Add required scopes

Add the following scopes under the **Scopes** section:

* `marketplace:write:app` — Create apps
* `marketplace:read:app` — View an app

### 4. Update the app using the Manifest API

Use the following endpoint to quickly configure a Zoom Marketplace app:

```
PUT /marketplace/apps/{appId}/manifest
```

* [Update an app by manifest API endpoint](https://developers.zoom.us/docs/api/marketplace/#tag/manifest/put/marketplace/apps/{appId}/manifest)

### 5. Use Manifest JSON object to create Zoom App

> [!NOTE]
> Replace placeholder URLs like `https://example.ngrok.io` with your actual tunnel URL (e.g., from ngrok).

```
{
    "manifest": {
        "display_information": {
            "display_name": "ZCC-NextJS-Sample"
        },
        "oauth_information": {
            "usage": "USER_OPERATION",
            "development_redirect_uri": "https://oauth.pstmn.io/v1/callback",
            "production_redirect_uri": "",
            "oauth_allow_list": [
                "https://oauth.pstmn.io/v1/callback"
            ],
            "strict_mode": false,
            "subdomain_strict_mode": false,
            "scopes": [
                {
                    "scope": "user:read:user",
                    "optional": false
                },
                {
                    "scope": "marketplace:read:app",
                    "optional": false
                },
                {
                    "scope": "marketplace:write:app",
                    "optional": false
                }
            ]
        },
        "features": {
            "products": [
                "ZOOM_CONTACT_CENTER"
            ],
            "development_home_uri": "Your.domain.ngrok.app",
            "production_home_uri": "",
            "domain_allow_list": [
                {
                    "domain": "appssdk.zoom.us",
                    "explanation": ""
                },
                {
                    "domain": "Your.domain.ngrok.app",
                    "explanation": ""
                }
            ],
            "in_client_feature": {
                "zoom_app_api": {
                    "enable": true,
                    "zoom_app_apis": [
                        "connect",
                        "getEngagementContext",
                        "getEngagementStatus",
                        "getRunningContext",
                        "getSupportedJsApis",
                        "getUserContext",
                        "onConnect",
                        "onEngagementContextChange",
                        "onEngagementMediaRedirect",
                        "onEngagementStatusChange",
                        "onEngagementVariableValueChange",
                        "onMyUserContextChange"
                    ]
                },
                "guest_mode": {
                    "enable": false,
                    "enable_test_guest_mode": false
                },
                "in_client_oauth": {
                    "enable": false
                },
                "collaborate_mode": {
                    "enable": false,
                    "enable_screen_sharing": false,
                    "enable_play_together": false,
                    "enable_start_immediately": false,
                    "enable_join_immediately": false
                }
            },
            "zoom_client_support": {
                "mobile": {
                    "enable": false
                },
                "zoom_room": {
                    "enable": false,
                    "enable_personal_zoom_room": false,
                    "enable_shared_zoom_room": false,
                    "enable_digital_signage": false,
                    "enable_zoom_rooms_controller": false
                },
                "pwa_client": {
                    "enable": false
                }
            },
            "embed": {
                "meeting_sdk": {
                    "enable": false,
                    "enable_device": false,
                    "devices": []
                },
                "contact_center_sdk": {
                    "enable": false
                },
                "phone_sdk": {
                    "enable": false
                }
            },
            "team_chat_subscription": {
                "enable": false,
                "enable_support_channel": false,
                "shortcuts": []
            },
            "event_subscription": {
                "enable": false,
                "events": []
            }
        }
    }
}
```