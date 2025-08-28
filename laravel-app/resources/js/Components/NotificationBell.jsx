import React, {useState, useEffect} from 'react';
import {Badge, Popover, Button, Text, Card, Spinner} from '@shopify/polaris';
import {NotificationIcon, EyeCheckMarkIcon, DeleteIcon} from '@shopify/polaris-icons';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        read: 0
    });

    useEffect(() => {
        fetchUnreadCount();
        fetchNotificationStats();

        // Set up polling for real-time updates
        const interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('/notifications/unread-count');
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const fetchNotificationStats = async () => {
        try {
            const response = await fetch('/notifications/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch notification stats:', error);
        }
    };

    const fetchNotifications = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch('/notifications?per_page=10');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                // Update local state
                setNotifications(prev => prev.map(notif =>
                    notif.id === notificationId
                        ? {...notif, read_at: new Date().toISOString()}
                        : notif
                ));
                fetchUnreadCount();
                fetchNotificationStats();
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/notifications/mark-all-read', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.map(notif => ({...notif, read_at: new Date().toISOString()})));
                fetchUnreadCount();
                fetchNotificationStats();
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                fetchNotificationStats();
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'thumbnail_ready':
                return '🖼️';
            case 'bulk_request_completed':
                return '📦';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (readAt) => {
        return readAt ? 'subdued' : 'success';
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (


        <Popover
            active={isOpen}
            activator={
                <Button
                    icon={NotificationIcon}
                    onClick={handleToggle}
                    variant="tertiary"
                    style={{
                        position: 'relative',
                        padding: '8px',
                        borderRadius: '50%',
                        minWidth: 'auto',
                        width: '40px',
                        height: '40px'
                    }}
                >
                    {unreadCount > 0 && (
                        <Badge
                            status="attention"
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                minWidth: '20px',
                                height: '20px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: 'bold'
                            }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            }
            onClose={() => setIsOpen(false)}
            preferredPosition="bottom"
            preferredAlignment="right"
        >
            <div style={{width: '400px', maxHeight: '500px', overflow: 'hidden'}}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e1e3e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}><Text variant="headingMd" as="h3"> 🔔 Notifications </Text>
                    <div style={{display: 'flex', gap: '8px'}}><Button size="slim" onClick={markAllAsRead}
                                                                       disabled={unreadCount === 0}
                                                                       variant="tertiary"> Mark all read </Button>
                        <Button size="slim" onClick={() => setIsOpen(false)} variant="tertiary"> Close </Button>
                    </div>
                </div>
                <div style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid #e1e3e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#6d7175'
                }}><span>{stats.total} total</span> <span>{stats.unread} unread</span>
                    <span>{stats.read} read</span></div>
                <div style={{maxHeight: '400px', overflowY: 'auto'}}> {isLoading ? (
                    <div style={{padding: '40px', textAlign: 'center'}}><Spinner size="large"/> <Text
                        variant="bodyMd" as="p" style={{marginTop: '16px'}}> Loading notifications... </Text>
                    </div>) : notifications.length === 0 ? (
                    <div style={{padding: '40px', textAlign: 'center', color: '#6d7175'}}><Text variant="bodyMd"
                                                                                                as="p"> No
                        notifications yet </Text></div>) : (notifications.map((notification) => (

                    <div key={notification.id} style={{
                        margin: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: notification.read_at ? '#ffffff' : '#f6f6f7'
                    }}>

                        <Card>
                            <div style={{padding: '16px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span
                                        style={{fontSize: '16px'}}> {getNotificationIcon(notification.data?.type)} </span>
                                        <Text variant="bodyMd" as="span" style={{
                                            fontWeight: notification.read_at ? '400' : '600',
                                            color: notification.read_at ? '#6d7175' : '#202223'
                                        }}> {notification.data?.type === 'thumbnail_ready' ? 'Thumbnail Ready' : 'Bulk Request Completed'} </Text>
                                    </div>
                                    <div style={{display: 'flex', gap: '4px'}}> {!notification.read_at && (
                                        <Button size="slim" icon={EyeCheckMarkIcon}
                                                onClick={() => markAsRead(notification.id)} variant="tertiary"
                                                style={{padding: '4px 8px'}}/>)} <Button size="slim" icon={DeleteIcon}
                                                                                         onClick={() => deleteNotification(notification.id)}
                                                                                         variant="tertiary"
                                                                                         style={{padding: '4px 8px'}}/>
                                    </div>
                                </div>
                                <Text variant="bodyMd" as="p" style={{
                                    color: notification.read_at ? '#6d7175' : '#202223',
                                    marginBottom: '8px',
                                    lineHeight: '1.4'
                                }}> {notification.data?.message || 'Notification message'} </Text> {notification.data?.image_url && (
                                <Text variant="bodySm" as="p" style={{
                                    color: '#6d7175',
                                    fontFamily: 'monospace',
                                    fontSize: '11px',
                                    wordBreak: 'break-all',
                                    backgroundColor: '#f6f6f7',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    marginBottom: '8px'
                                }}> {notification.data.image_url} </Text>)} <Text variant="bodySm" as="span" style={{
                                color: '#6d7175',
                                fontSize: '11px'
                            }}> {formatTime(notification.created_at)} </Text></div>
                        </Card></div>)))} </div>
            </div>
        </Popover>

    );
}
