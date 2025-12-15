## Zoom App Manifest configuration

Replace any placeholder URL such as https://example.ngrok.io with your actual ngrok-generated URL.

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