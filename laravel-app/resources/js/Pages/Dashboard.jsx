import {Head} from '@inertiajs/react';
import {
    Page,
    Card,
    Select,
    Badge,
    Toast,
    Text,
    TextField,
    Banner,
    ProgressBar,
    EmptyState,
    Modal,
    Frame
} from '@shopify/polaris';
import {useState, useEffect} from 'react';
import {router} from '@inertiajs/react';
import NotificationBell from '../Components/NotificationBell';
import NotificationSettings from '../Components/NotificationSettings';


export default function Dashboard({auth, flash}) {
    const [imageUrls, setImageUrls] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);
    const [errors, setErrors] = useState({});
    const [bulkRequests, setBulkRequests] = useState([]);
    const [showUrlModal, setShowUrlModal] = useState(false);

    const statusFilterOptions = [
        {label: 'All Statuses', value: 'all'},
        {label: 'Pending', value: 'pending'},
        {label: 'Processing', value: 'processing'},
        {label: 'Completed', value: 'completed'},
        {label: 'Failed', value: 'failed'}
    ];

    const filteredBulkRequests = statusFilter === 'all'
        ? bulkRequests
        : bulkRequests.map(request => ({
            ...request,
            imageThumbnails: (request.imageThumbnails || []).filter(
                thumbnail => thumbnail.status === statusFilter
            )
        })).filter(request => (request.imageThumbnails || []).length > 0);

    const submitUrls = async () => {
        if (!imageUrls.trim()) {
            showToast('Please enter at least one image URL', true);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch('/thumbnails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({image_urls: imageUrls})
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message);
                setImageUrls('');
                setShowUrlModal(false);
                await fetchBulkRequests();
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    showToast(result.error || 'Failed to submit request', true);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Error: ' + error.message, true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchBulkRequests = async () => {
        try {
            const response = await fetch('/thumbnails/results');
            if (response.ok) {
                const data = await response.json();
                // Ensure each bulk request has imageThumbnails array
                const requests = (data.bulk_requests || []).map(request => ({
                    ...request,
                    imageThumbnails: request.imageThumbnails || []
                }));
                setBulkRequests(requests);
            }
        } catch (error) {
            console.error('Failed to fetch bulk requests:', error);
        }
    };

    const refreshResults = async () => {
        setIsRefreshing(true);
        try {
            await fetchBulkRequests();
            showToast('Results refreshed');
        } catch (error) {
            showToast('Failed to refresh results', true);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getStatusBadgeStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'info';
            case 'processing':
                return 'attention';
            case 'completed':
                return 'success';
            case 'failed':
                return 'critical';
            default:
                return 'info';
        }
    };

    const getProgressPercentage = (request) => {
        const total = request.total_images;
        const processed = request.processed_images + request.failed_images;
        return total > 0 ? Math.round((processed / total) * 100) : 0;
    };

    const showToast = (message, isError = false) => {
        setToastMessage(message);
        setToastError(isError);
        setTimeout(() => {
            setToastMessage('');
            setToastError(false);
        }, 5000);
    };

    useEffect(() => {
        fetchBulkRequests();
        const interval = setInterval(fetchBulkRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    // Check for new notifications and show toasts
    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const response = await fetch('/notifications/unread-count');
                if (response.ok) {
                    const data = await response.json();
                    if (data.count > 0) {
                        // Show a toast for new notifications
                        showToast(`You have ${data.count} new notification${data.count > 1 ? 's' : ''}!`, false);
                    }
                }
            } catch (error) {
                console.error('Failed to check notifications:', error);
            }
        };

        // Check notifications every 30 seconds
        const notificationInterval = setInterval(checkNotifications, 30000);
        return () => clearInterval(notificationInterval);
    }, []);

    useEffect(() => {
        if (flash.message) {
            showToast(flash.message);
        }
        if (flash.error) {
            showToast(flash.error, true);
        }
    }, [flash]);

    const getSubscriptionIcon = (tier) => {
        switch (tier) {
            case 'free':
                return '🎯';
            case 'pro':
                return '🚀';
            case 'enterprise':
                return '🏢';
            default:
                return '🎯';
        }
    };





    return (
        <Frame>
            <Head title="Dashboard"/>

            <Page
                title="Bulk Thumbnail Processor"
                subtitle={`Welcome back, ${auth.user?.name || 'User'}!`}
                primaryAction={{
                    content: '🚀 Process New Images',
                    onAction: () => setShowUrlModal(true),
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        borderRadius: '12px',
                        fontWeight: '600'
                    }
                }}

                secondaryActions={[
                    {
                        content: '🔄 Refresh',
                        onAction: refreshResults,
                        loading: isRefreshing,
                        style: {
                            borderRadius: '12px',
                            fontWeight: '500'
                        }
                    },

                    {
                        content: '🚪 Logout',
                        onAction: () => router.post('/logout'),
                        style: {
                            borderRadius: '12px',
                            fontWeight: '500'
                        }
                    },
                    {
                        content: <NotificationBell/>,

                    }

                ]}

            >
                {/* User Stats Banner */}

                <div className="mb-5">
                    <Card>
                        <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Background Pattern */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                                zIndex: 0
                            }}></div>

                            <div style={{position: 'relative', zIndex: 1}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '24px'
                                }}>
                                    <div>
                                        <Text variant="headingLg" as="h2" style={{
                                            color: '#1e293b',
                                            fontWeight: '700',
                                            marginBottom: '8px'
                                        }}>
                                            📊 Usage Statistics
                                        </Text>
                                        <Text variant="bodyMd" as="p" style={{color: '#64748b'}}>
                                            Monitor your image processing quota and usage
                                        </Text>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}>
                                        <div style={{
                                            padding: '12px 20px',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }}>
                                            <Text variant="bodyMd" as="p" style={{
                                                color: '#667eea',
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}>
                                                {getSubscriptionIcon(auth.user?.subscription_tier || 'free')} {auth.user?.subscription_tier || 'free'} Plan
                                            </Text>
                                            <Text variant="bodySm" as="p" style={{
                                                color: '#667eea',
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                marginTop: '4px',
                                                fontSize: '12px'
                                            }}>
                                                {auth.user?.subscription_tier === 'enterprise' ? '3x' : 
                                                 auth.user?.subscription_tier === 'pro' ? '2x' : '1x'} Priority Processing
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', gap: '40px', marginBottom: '24px'}}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        flex: 1
                                    }}>
                                        <Text variant="headingLg" as="h3" style={{
                                            color: '#667eea',
                                            fontWeight: '700',
                                            marginBottom: '4px'
                                        }}>
                                            {bulkRequests.length}
                                        </Text>
                                        <Text variant="bodyMd" as="p" style={{color: '#64748b', fontWeight: '500'}}>
                                            Total Requests
                                        </Text>
                                    </div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(10px)',
                                        flex: 1
                                    }}>
                                        <Text variant="headingLg" as="h3" style={{
                                            color: '#764ba2',
                                            fontWeight: '700',
                                            marginBottom: '4px'
                                        }}>
                                            {auth.user?.quota_limit || 50}
                                        </Text>
                                        <Text variant="bodyMd" as="p" style={{color: '#64748b', fontWeight: '500'}}>
                                            Per Request Limit
                                        </Text>
                                    </div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(10px)',
                                        flex: 1
                                    }}>
                                        <Text variant="headingLg" as="h3" style={{
                                            color: '#10b981',
                                            fontWeight: '700',
                                            marginBottom: '4px'
                                        }}>
                                            {bulkRequests.reduce((total, req) => total + (req.imageThumbnails?.length || 0), 0)}
                                        </Text>
                                        <Text variant="bodyMd" as="p" style={{color: '#64748b', fontWeight: '500'}}>
                                            Total Images Processed
                                        </Text>
                                    </div>
                                </div>

                                <div style={{marginTop: '20px'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '8px'
                                    }}>
                                        <Text variant="bodyMd" as="span" style={{color: '#64748b', fontWeight: '500'}}>
                                            Plan Usage
                                        </Text>
                                        <Text variant="bodyMd" as="span" style={{color: '#64748b', fontWeight: '600'}}>
                                            {bulkRequests.length > 0 ? 'Active' : 'No Requests Yet'}
                                        </Text>
                                    </div>
                                    <ProgressBar
                                        progress={bulkRequests.length > 0 ? 100 : 0}
                                        size="large"
                                        color={bulkRequests.length > 0 ? 'success' : 'info'}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* Priority Processing Information */}
                <div className="mb-5">
                    <Card>
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            border: '1px solid #bae6fd',
                            position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '16px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }}>
                                    ⚡
                                </div>
                                <div>
                                    <Text variant="headingMd" as="h3" style={{
                                        color: '#1e40af',
                                        fontWeight: '700',
                                        marginBottom: '4px'
                                    }}>
                                        Priority Processing System
                                    </Text>
                                    <Text variant="bodyMd" as="p" style={{color: '#475569'}}>
                                        Your subscription tier determines your processing priority
                                    </Text>
                                </div>
                            </div>
                            
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textAlign: 'center'
                                }}>
                                    <Text variant="headingMd" as="h4" style={{
                                        color: '#667eea',
                                        fontWeight: '700',
                                        marginBottom: '8px'
                                    }}>
                                        🎯 Free Plan
                                    </Text>
                                    <Text variant="bodyMd" as="p" style={{
                                        color: '#64748b',
                                        fontSize: '13px',
                                        marginBottom: '8px'
                                    }}>
                                        1x Priority
                                    </Text>
                                    <Text variant="bodySm" as="p" style={{
                                        color: '#94a3b8',
                                        fontSize: '12px'
                                    }}>
                                        Standard processing speed
                                    </Text>
                                </div>
                                
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textAlign: 'center'
                                }}>
                                    <Text variant="headingMd" as="h4" style={{
                                        color: '#764ba2',
                                        fontWeight: '700',
                                        marginBottom: '8px'
                                    }}>
                                        ⚡ Pro Plan
                                    </Text>
                                    <Text variant="bodyMd" as="p" style={{
                                        color: '#64748b',
                                        fontSize: '13px',
                                        marginBottom: '8px'
                                    }}>
                                        2x Priority
                                    </Text>
                                    <Text variant="bodySm" as="p" style={{
                                        color: '#94a3b8',
                                        fontSize: '12px'
                                    }}>
                                        2x faster processing
                                    </Text>
                                </div>
                                
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textAlign: 'center'
                                }}>
                                    <Text variant="headingMd" as="h4" style={{
                                        color: '#3b82f6',
                                        fontWeight: '700',
                                        marginBottom: '8px'
                                    }}>
                                        🚀 Enterprise Plan
                                    </Text>
                                    <Text variant="bodyMd" as="p" style={{
                                        color: '#64748b',
                                        fontSize: '13px',
                                        marginBottom: '8px'
                                    }}>
                                        3x Priority
                                    </Text>
                                    <Text variant="bodySm" as="p" style={{
                                        color: '#94a3b8',
                                        fontSize: '12px'
                                    }}>
                                        3x faster processing
                                    </Text>
                                </div>
                            </div>
                            
                            <div style={{
                                marginTop: '16px',
                                padding: '12px 16px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(59, 130, 246, 0.2)'
                            }}>
                                <Text variant="bodyMd" as="p" style={{
                                    color: '#1e40af',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    margin: 0
                                }}>
                                    💡 <strong>Current Status:</strong> You have <strong>{auth.user?.subscription_tier === 'enterprise' ? '3x' : auth.user?.subscription_tier === 'pro' ? '2x' : '1x'}</strong> priority processing • <strong>{auth.user?.quota_limit || 50} images per request</strong> • <strong>Unlimited requests</strong>
                                </Text>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* All Images Overview */}
                <Card style={{marginBottom: '24px'}}>
                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <Text variant="headingMd" as="h2" style={{
                                    color: '#1e293b',
                                    fontWeight: '700'
                                }}>
                                    📊 All Images Overview
                                </Text>
                                <Badge status="info" style={{
                                    fontSize: '12px',
                                    padding: '4px 12px',
                                    borderRadius: '20px'
                                }}>
                                    {bulkRequests.reduce((total, req) => total + (req.imageThumbnails?.length || 0), 0)} Images
                                </Badge>
                            </div>

                            <Select
                                label="Filter by status"
                                labelInline
                                options={statusFilterOptions}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                style={{
                                    minWidth: '200px'
                                }}
                            />
                        </div>

                        {/* All Images Table */}
                        {(() => {
                            // Get all images from all bulk requests for the current user
                            const allImages = bulkRequests.flatMap(req => 
                                (req.imageThumbnails || []).map(img => ({
                                    ...img,
                                    requestId: req.id,
                                    requestCreatedAt: req.created_at
                                }))
                            );
                            
                            // Apply status filter
                            const filteredImages = statusFilter === 'all' 
                                ? allImages 
                                : allImages.filter(img => img.status === statusFilter);

                            if (filteredImages.length === 0) {
                                return (
                                    <Card style={{
                                        padding: '40px',
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <EmptyState
                                            heading={allImages.length === 0 ? "No images processed yet" : "No images match your filter"}
                                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                        >
                                            <p style={{color: '#64748b'}}>
                                                {allImages.length === 0 
                                                    ? "Submit your first image URLs to start processing thumbnails."
                                                    : "Try changing your status filter to see more results."
                                                }
                                            </p>
                                        </EmptyState>
                                    </Card>
                                );
                            }

                            return (
                                <div>
                                    {/* Table Header */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto auto',
                                        gap: '16px',
                                        padding: '16px',
                                        background: 'rgba(102, 126, 234, 0.08)',
                                        borderRadius: '12px 12px 0 0',
                                        border: '1px solid #e2e8f0',
                                        borderBottom: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: '#374151'
                                    }}>
                                        <div>Image URL</div>
                                        <div style={{textAlign: 'center'}}>Status</div>
                                        <div style={{textAlign: 'center'}}>Timestamp</div>
                                    </div>
                                    
                                    <div style={{
                                        display: 'grid',
                                        gap: '0',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0 0 12px 12px',
                                        overflow: 'hidden',
                                        maxHeight: '500px',
                                        overflowY: 'auto'
                                    }}>
                                        {filteredImages.map((image, index) => (
                                            <div key={`${image.requestId}-${image.id}`} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr auto auto',
                                                gap: '16px',
                                                padding: '16px',
                                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                                                borderBottom: index < filteredImages.length - 1 ? '1px solid #e2e8f0' : 'none',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    wordBreak: 'break-all',
                                                    fontFamily: 'monospace',
                                                    fontSize: '13px',
                                                    color: '#374151',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {image.image_url}
                                                </div>
                                                <div style={{textAlign: 'center'}}>
                                                    <Badge status={getStatusBadgeStatus(image.status)}
                                                           style={{
                                                               fontSize: '11px',
                                                               padding: '6px 12px',
                                                               borderRadius: '16px',
                                                               fontWeight: '600',
                                                               minWidth: '80px'
                                                           }}>
                                                        {image.status === 'completed' ? '✅ Processed' : 
                                                         image.status === 'pending' ? '⏳ Pending' : 
                                                         image.status === 'failed' ? '❌ Failed' : 
                                                         image.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div style={{
                                                    textAlign: 'center',
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    fontFamily: 'monospace',
                                                    minWidth: '140px'
                                                }}>
                                                    {image.created_at ? 
                                                        new Date(image.created_at).toLocaleString() : 
                                                        new Date(image.requestCreatedAt).toLocaleString()
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Summary Stats */}
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        background: 'rgba(102, 126, 234, 0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(102, 126, 234, 0.2)'
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <div>
                                                <Text variant="headingMd" as="h3" style={{
                                                    color: '#667eea',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {filteredImages.length}
                                                </Text>
                                                <Text variant="bodyMd" as="p" style={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    Total Images
                                                </Text>
                                            </div>
                                            <div>
                                                <Text variant="headingMd" as="h3" style={{
                                                    color: '#10b981',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {filteredImages.filter(img => img.status === 'completed').length}
                                                </Text>
                                                <Text variant="bodyMd" as="p" style={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    ✅ Processed
                                                </Text>
                                            </div>
                                            <div>
                                                <Text variant="headingMd" as="h3" style={{
                                                    color: '#3b82f6',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {filteredImages.filter(img => img.status === 'pending').length}
                                                </Text>
                                                <Text variant="headingMd" as="p" style={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    ⏳ Pending
                                                </Text>
                                            </div>
                                            <div>
                                                <Text variant="headingMd" as="h3" style={{
                                                    color: '#ef4444',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {filteredImages.filter(img => img.status === 'failed').length}
                                                </Text>
                                                <Text variant="headingMd" as="p" style={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    ❌ Failed
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </Card>

                {/* Processing Results */}
                <Card style={{marginBottom: '24px'}}>
                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <Text variant="headingMd" as="h2" style={{
                                    color: '#1e293b',
                                    fontWeight: '700'
                                }}>
                                    📈 Processing Results
                                </Text>
                                <Badge status="info" style={{
                                    fontSize: '12px',
                                    padding: '4px 12px',
                                    borderRadius: '20px'
                                }}>
                                    {bulkRequests.length} Requests
                                </Badge>
                            </div>

                            <Select
                                label="Filter by status"
                                labelInline
                                options={statusFilterOptions}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                style={{
                                    minWidth: '200px'
                                }}
                            />
                        </div>

                        {filteredBulkRequests.map(bulkRequest => (
                            <Card key={bulkRequest.id} style={{
                                marginBottom: '20px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{
                                    padding: '24px',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                            <Text variant="headingMd" as="h3" style={{
                                                color: '#1e293b',
                                                fontWeight: '600'
                                            }}>
                                                Request #{bulkRequest.id}
                                            </Text>
                                            <Badge status={getStatusBadgeStatus(bulkRequest.status)} style={{
                                                fontSize: '11px',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontWeight: '600'
                                            }}>
                                                {bulkRequest.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                            <Badge status={bulkRequest.priority === 3 ? 'success' : bulkRequest.priority === 2 ? 'attention' : 'info'} style={{
                                                fontSize: '11px',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontWeight: '600'
                                            }}>
                                                {bulkRequest.priority === 3 ? '🚀' : bulkRequest.priority === 2 ? '⚡' : '🎯'} Priority: {bulkRequest.priority}x
                                            </Badge>
                                            <Text variant="bodyMd" color="subdued" style={{fontSize: '13px'}}>
                                                {new Date(bulkRequest.created_at).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                        gap: '16px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }}>
                                            <Text variant="headingLg" as="h3" style={{
                                                color: '#667eea',
                                                fontWeight: '700',
                                                marginBottom: '4px'
                                            }}>
                                                {bulkRequest.total_images}
                                            </Text>
                                            <Text variant="bodyMd" as="p" style={{
                                                color: '#64748b',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                Total Images
                                            </Text>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(16, 185, 129, 0.2)'
                                        }}>
                                            <Text variant="headingLg" as="h3" style={{
                                                color: '#10b981',
                                                fontWeight: '700',
                                                marginBottom: '4px'
                                            }}>
                                                {bulkRequest.processed_images}
                                            </Text>
                                            <Text variant="bodyMd" as="p" style={{
                                                color: '#64748b',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                Processed
                                            </Text>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(239, 68, 68, 0.2)'
                                        }}>
                                            <Text variant="headingLg" as="h3" style={{
                                                color: '#ef4444',
                                                fontWeight: '700',
                                                marginBottom: '4px'
                                            }}>
                                                {bulkRequest.failed_images}
                                            </Text>
                                            <Text variant="bodyMd" as="p" style={{
                                                color: '#64748b',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                Failed
                                            </Text>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                        }}>
                                            <Text variant="headingLg" as="h3" style={{
                                                color: '#3b82f6',
                                                fontWeight: '700',
                                                marginBottom: '4px'
                                            }}>
                                                {getProgressPercentage(bulkRequest)}%
                                            </Text>
                                            <Text variant="bodyMd" as="p" style={{
                                                color: '#64748b',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                Complete
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Text variant="bodyMd" as="span" style={{
                                                color: '#64748b',
                                                fontWeight: '500',
                                                fontSize: '13px'
                                            }}>
                                                Progress
                                            </Text>
                                            <Text variant="bodyMd" as="span" style={{
                                                color: '#64748b',
                                                fontWeight: '600',
                                                fontSize: '13px'
                                            }}>
                                                {getProgressPercentage(bulkRequest)}%
                                            </Text>
                                        </div>
                                        <ProgressBar
                                            progress={getProgressPercentage(bulkRequest)}
                                            size="large"
                                            color={getProgressPercentage(bulkRequest) === 100 ? 'success' : 'primary'}
                                        />
                                    </div>

                                    {bulkRequest.imageThumbnails && bulkRequest.imageThumbnails.length > 0 && (
                                        <div style={{marginTop: '24px'}}>
                                            <Text variant="headingMd" as="h3" style={{
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                marginBottom: '16px'
                                            }}>
                                                📷 Image Details
                                            </Text>
                                            
                                            {/* Table Header */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr auto auto',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                background: 'rgba(102, 126, 234, 0.05)',
                                                borderRadius: '8px 8px 0 0',
                                                border: '1px solid #e2e8f0',
                                                borderBottom: 'none',
                                                fontWeight: '600',
                                                fontSize: '13px',
                                                color: '#374151'
                                            }}>
                                                <div>Image URL</div>
                                                <div style={{textAlign: 'center'}}>Status</div>
                                                <div style={{textAlign: 'center'}}>Timestamp</div>
                                            </div>
                                            
                                            <div style={{
                                                display: 'grid',
                                                gap: '0',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0 0 8px 8px',
                                                overflow: 'hidden'
                                            }}>
                                                {bulkRequest.imageThumbnails.map((thumbnail, index) => (
                                                    <div key={thumbnail.id} style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr auto auto',
                                                        gap: '12px',
                                                        padding: '16px',
                                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                                                        borderBottom: index < bulkRequest.imageThumbnails.length - 1 ? '1px solid #e2e8f0' : 'none',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{
                                                            wordBreak: 'break-all',
                                                            fontFamily: 'monospace',
                                                            fontSize: '13px',
                                                            color: '#374151'
                                                        }}>
                                                            {thumbnail.image_url}
                                                        </div>
                                                        <div style={{textAlign: 'center'}}>
                                                            <Badge status={getStatusBadgeStatus(thumbnail.status)}
                                                                   style={{
                                                                       fontSize: '11px',
                                                                       padding: '6px 12px',
                                                                       borderRadius: '16px',
                                                                       fontWeight: '600',
                                                                       minWidth: '80px'
                                                                   }}>
                                                                {thumbnail.status.toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <div style={{
                                                            textAlign: 'center',
                                                            fontSize: '12px',
                                                            color: '#6b7280',
                                                            fontFamily: 'monospace'
                                                        }}>
                                                            {thumbnail.created_at ? 
                                                                new Date(thumbnail.created_at).toLocaleString() : 
                                                                new Date(bulkRequest.created_at).toLocaleString()
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Status Summary */}
                                            <div style={{
                                                marginTop: '16px',
                                                padding: '12px 16px',
                                                background: 'rgba(102, 126, 234, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(102, 126, 234, 0.2)'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    fontSize: '13px',
                                                    color: '#374151'
                                                }}>
                                                    <span>Total Images: <strong>{bulkRequest.imageThumbnails.length}</strong></span>
                                                    <span>Processed: <strong style={{color: '#10b981'}}>{bulkRequest.imageThumbnails.filter(t => t.status === 'completed').length}</strong></span>
                                                    <span>Pending: <strong style={{color: '#3b82f6'}}>{bulkRequest.imageThumbnails.filter(t => t.status === 'pending').length}</strong></span>
                                                    <span>Failed: <strong style={{color: '#ef4444'}}>{bulkRequest.imageThumbnails.filter(t => t.status === 'failed').length}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {filteredBulkRequests.length === 0 && bulkRequests.length > 0 && (
                            <Card style={{
                                padding: '40px',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <EmptyState
                                    heading="No results match your filter"
                                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                >
                                    <p style={{color: '#64748b'}}>Try changing your status filter to see more
                                        results.</p>
                                </EmptyState>
                            </Card>
                        )}

                        {bulkRequests.length === 0 && (
                            <Card style={{
                                padding: '40px',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <EmptyState
                                    heading="No processing requests yet"
                                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                >
                                    <p style={{color: '#64748b'}}>Submit your first image URLs to start processing
                                        thumbnails.</p>
                                </EmptyState>
                            </Card>
                        )}
                    </div>
                </Card>

                {/* URL Submission Modal */}
                <Modal
                    open={showUrlModal}
                    onClose={() => setShowUrlModal(false)}
                    title="🚀 Process New Images"
                    primaryAction={{
                        content: 'Process Images',
                        onAction: submitUrls,
                        loading: isSubmitting,
                        disabled: isSubmitting || !imageUrls.trim(),
                        style: {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600'
                        }
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => setShowUrlModal(false),
                            style: {
                                borderRadius: '12px'
                            }
                        }
                    ]}
                >
                    <Modal.Section>
                        <div style={{marginBottom: '24px'}}>
                            <TextField
                                label="Image URLs"
                                value={imageUrls}
                                onChange={setImageUrls}
                                multiline={4}
                                placeholder="Enter image URLs, one per line..."
                                helpText={`You can submit up to ${auth.user?.quota_limit || 50} images per request. You can make multiple requests as needed.`}
                                error={errors.image_urls}
                                autoComplete={true}
                            />
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <Banner status="critical" title="Validation Errors">
                                {Object.values(errors).map((error, index) => (
                                    <p key={index} style={{margin: '4px 0'}}>{error}</p>
                                ))}
                            </Banner>
                        )}
                    </Modal.Section>
                </Modal>

                {/* Toast Messages */}
                {toastMessage && (
                    <Toast
                        content={toastMessage}
                        error={toastError}
                        onDismiss={() => setToastMessage('')}
                        duration={5000}
                    />
                )}
            </Page>
        </Frame>
    );
}
