import React, {useState} from 'react';
import {Card, Text, Select, Button, Banner} from '@shopify/polaris';

export default function NotificationSettings() {
    const [settings, setSettings] = useState({
        email_notifications: 'all',
        browser_notifications: 'all',
        processing_updates: 'all',
        completion_notifications: 'all'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const notificationOptions = [
        {label: 'All notifications', value: 'all'},
        {label: 'Important only', value: 'important'},
        {label: 'None', value: 'none'}
    ];

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            // In a real app, you'd save these to the backend
            // For now, we'll just simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <div style={{padding: '24px'}}>
                <Text variant="headingMd" as="h3" style={{marginBottom: '20px'}}>
                    🔔 Notification Preferences
                </Text>

                {message && (
                    <Banner
                        status={message.includes('successfully') ? 'success' : 'critical'}
                        style={{marginBottom: '20px'}}
                    >
                        {message}
                    </Banner>
                )}

                <Card vertical spacing="loose">
                    <div>
                        <Text variant="bodyMd" as="p" style={{marginBottom: '8px', fontWeight: '500'}}>
                            Email Notifications
                        </Text>
                        <Select
                            options={notificationOptions}
                            value={settings.email_notifications}
                            onChange={(value) => handleSettingChange('email_notifications', value)}
                            helpText="Receive email notifications for processing updates"
                            label=''/>
                    </div>

                    <div>
                        <Text variant="bodyMd" as="p" style={{marginBottom: '8px', fontWeight: '500'}}>
                            Browser Notifications
                        </Text>
                        <Select
                            label=''
                            options={notificationOptions}
                            value={settings.browser_notifications}
                            onChange={(value) => handleSettingChange('browser_notifications', value)}
                            helpText="Show browser notifications when thumbnails are ready"
                        />
                    </div>

                    <div>
                        <Text variant="bodyMd" as="p" style={{marginBottom: '8px', fontWeight: '500'}}>
                            Processing Updates
                        </Text>
                        <Select
                            label=''
                            options={notificationOptions}
                            value={settings.processing_updates}
                            onChange={(value) => handleSettingChange('processing_updates', value)}
                            helpText="Get notified about individual thumbnail processing status"
                        />
                    </div>

                    <div>
                        <Text variant="bodyMd" as="p" style={{marginBottom: '8px', fontWeight: '500'}}>
                            Completion Notifications
                        </Text>
                        <Select
                            label=''
                            options={notificationOptions}
                            value={settings.completion_notifications}
                            onChange={(value) => handleSettingChange('completion_notifications', value)}
                            helpText="Receive notifications when bulk requests are completed"
                        />
                    </div>

                    <div style={{marginTop: '20px'}}>
                        <Button
                            primary
                            onClick={saveSettings}
                            loading={isLoading}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600'
                            }}
                        >
                            Save Preferences
                        </Button>
                    </div>
                </Card>
            </div>
        </Card>
    );
}
