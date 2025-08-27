import { Head, useForm } from '@inertiajs/react';
import { Button, TextField, Banner, Text } from '@shopify/polaris';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [copyMessage, setCopyMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyMessage(`${type} copied!`);
            setTimeout(() => setCopyMessage(''), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const useDemoAccount = (account) => {
        setData('email', account.email);
        setData('password', account.password);
        setCopyMessage(`✅ ${account.tier} account loaded!`);
        setTimeout(() => setCopyMessage(''), 2000);
    };

    const demoAccounts = [
        {
            tier: 'Free',
            email: 'free@example.com',
            password: 'password',
            icon: '🎯',
            color: 'rgba(102, 126, 234, 0.1)',
            borderColor: 'rgba(102, 126, 234, 0.2)',
            textColor: '#667eea',
            quota: '50 images',
            priority: '1x'
        },
        {
            tier: 'Pro',
            email: 'pro@example.com',
            password: 'password',
            icon: '⚡',
            color: 'rgba(118, 75, 162, 0.1)',
            borderColor: 'rgba(118, 75, 162, 0.2)',
            textColor: '#764ba2',
            quota: '100 images',
            priority: '2x'
        },
        {
            tier: 'Enterprise',
            email: 'enterprise@example.com',
            password: 'password',
            icon: '🏢',
            color: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.2)',
            textColor: '#3b82f6',
            quota: '200 images',
            priority: '3x'
        }
    ];

    return (
        <>
            <Head title="Login" />

            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    margin: '0',
                    overflow: 'auto',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
            >
                {/* Main Container */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '1400px',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'row',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden',
                    }}
                    className="login-container"
                >
                        {/* Left Side - Login Form */}
                        <div
                            style={{
                                flex: '1',
                                minWidth: '500px',
                                height: '100%',
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                borderBottom: 'none',
                            }}
                            className="login-form-side"
                        >
                            <div style={{ 
                                width: '100%', 
                                maxWidth: '450px' 
                            }}
                            className="login-form-container">
                                {/* Header */}
                                <div style={{ 
                                    textAlign: 'center', 
                                    marginBottom: '40px' 
                                }}
                                className="login-header">
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '50%',
                                            margin: '0 auto 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        }}
                                        className="login-icon"
                                    >
                                        <span style={{ 
                                            color: 'white', 
                                            fontSize: '32px', 
                                            fontWeight: 'bold' 
                                        }}
                                        className="login-icon-text">
                                            🚀
                                        </span>
                                    </div>
                                    <h1
                                        style={{
                                            fontSize: '28px',
                                            fontWeight: '700',
                                            margin: '0 0 12px 0',
                                            color: '#1e293b',
                                            letterSpacing: '-0.5px',
                                        }}
                                        className="login-title"
                                    >
                                        Welcome Back
                                    </h1>
                                    <p style={{
                                        color: '#64748b',
                                        margin: '0',
                                        fontSize: '16px',
                                        fontWeight: '400'
                                    }}
                                    className="login-subtitle">
                                        Sign in to your Bulk Thumbnail Processor account
                                    </p>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <TextField
                                            label="Email address"
                                            type="email"
                                            value={data.email}
                                            onChange={(value) => setData('email', value)}
                                            error={errors.email}
                                            autoComplete="new-email"
                                            required
                                            placeholder="Enter your email"
                                            labelHidden
                                            prefix="📧"
                                        />
                                    </div>

                                    <div style={{ marginBottom: '32px' }}>
                                        <TextField
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(value) => setData('password', value)}
                                            error={errors.password}
                                            autoComplete="new-password"
                                            required
                                            placeholder="Enter your password"
                                            labelHidden
                                            prefix="🔒"
                                            connectedRight={
                                                <Button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    size="slim"
                                                    monochrome
                                                    outline
                                                >
                                                    {showPassword ? '🙈' : '👁️'}
                                                </Button>
                                            }
                                        />
                                    </div>

                                    {/* Errors */}
                                    {(errors.email || errors.password) && (
                                        <div style={{ marginBottom: '24px' }}>
                                            {errors.email && (
                                                <Banner status="critical" title="Email Error">
                                                    {errors.email}
                                                </Banner>
                                            )}
                                            {errors.password && (
                                                <Banner status="critical" title="Password Error">
                                                    {errors.password}
                                                </Banner>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        submit
                                        primary
                                        fullWidth
                                        size="large"
                                        loading={processing}
                                        disabled={processing}
                                        style={{
                                            height: '52px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        }}
                                    >
                                        {processing ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>

                                {/* Sign Up Link */}
                                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <p style={{ color: '#6d7175', margin: '0', fontSize: '15px' }}>
                                        Don't have an account?{' '}
                                        <a
                                            href="/register"
                                            style={{
                                                color: '#667eea',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                transition: 'color 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                        >
                                            Create one here
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Demo Info */}
                        <div
                            style={{
                                flex: '1',
                                minWidth: '500px',
                                height: '100%',
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                            }}
                            className="login-info-side"
                        >
                            <div style={{ 
                                width: '100%', 
                                maxWidth: '500px' 
                            }}
                            className="login-info-container">
                                                                {/* Demo Header */}
                                <div style={{ 
                                    textAlign: 'center', 
                                    marginBottom: '40px' 
                                }}
                                className="login-info-header">
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '50%',
                                            margin: '0 auto 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        }}
                                        className="login-info-icon"
                                    >
                                        <span style={{ 
                                            color: 'white', 
                                            fontSize: '32px', 
                                            fontWeight: 'bold' 
                                        }}
                                        className="login-info-icon-text">
                                            🎯
                                        </span>
                                    </div>
                                    <h2
                                        style={{
                                            fontSize: '28px',
                                            fontWeight: '700',
                                            margin: '0 0 12px 0',
                                            color: '#1e293b',
                                            letterSpacing: '-0.5px',
                                        }}
                                        className="login-info-title"
                                    >
                                        Demo Accounts
                                    </h2>
                                    <p style={{ 
                                        color: '#64748b', 
                                        margin: '0',
                                        fontSize: '16px',
                                        fontWeight: '400'
                                    }}
                                    className="login-info-subtitle">
                                        Try our platform with these pre-configured accounts
                                    </p>
                                </div>

                                {/* Status Message */}
                                {copyMessage && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '16px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        marginBottom: '20px',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
                                    }}>
                                        <Text variant="bodyMd" style={{
                                            color: '#10b981',
                                            fontWeight: '600',
                                            margin: 0,
                                            fontSize: '15px'
                                        }}>
                                            {copyMessage}
                                        </Text>
                                    </div>
                                )}

                                {/* Demo Accounts */}
                                <div style={{ marginBottom: '32px' }}>
                                    {demoAccounts.map((account, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '28px',
                                                background: account.color,
                                                borderRadius: '16px',
                                                border: `1px solid ${account.borderColor}`,
                                                marginBottom: '24px',
                                                position: 'relative',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            }}
                                            className="demo-account-card"
                                        >
                                            {/* Plan Header */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '20px'
                                            }}
                                            className="plan-header">
                                                <span style={{
                                                    fontSize: '28px',
                                                    marginRight: '16px'
                                                }}
                                                className="plan-icon">
                                                    {account.icon}
                                                </span>
                                                <div className="plan-details">
                                                    <Text variant="headingMd" as="h3" style={{
                                                        color: account.textColor,
                                                        fontWeight: '700',
                                                        margin: '0 0 4px 0',
                                                        fontSize: '20px'
                                                    }}
                                                    className="plan-title">
                                                        {account.tier} Plan
                                                    </Text>
                                                    <Text variant="bodyMd" style={{
                                                        color: '#64748b',
                                                        margin: 0,
                                                        fontSize: '14px'
                                                    }}
                                                    className="plan-subtitle">
                                                        {account.quota} • {account.priority} Priority
                                                    </Text>
                                                </div>
                                            </div>

                                            {/* Use Account Button */}
                                            <Button
                                                fullWidth
                                                primary
                                                onClick={() => useDemoAccount(account)}
                                                style={{
                                                    height: '48px',
                                                    fontSize: '15px',
                                                    fontWeight: '600',
                                                    borderRadius: '12px',
                                                    background: `linear-gradient(135deg, ${account.textColor} 0%, ${account.textColor}dd 100%)`,
                                                    border: 'none',
                                                    boxShadow: `0 4px 15px ${account.textColor}40`,
                                                }}
                                                className="use-account-button"
                                            >
                                                🚀 Use This Account
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Features Preview */}
                                <div style={{
                                    padding: '24px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center'
                                }}
                                className="features-preview">
                                    <Text variant="headingMd" as="h3" style={{
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        margin: '0 0 16px 0',
                                        fontSize: '20px'
                                    }}
                                    className="features-title">
                                        ✨ What You'll Get
                                    </Text>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        lineHeight: '1.6'
                                    }}
                                    className="features-content">
                                        <div style={{ marginBottom: '8px' }}>
                                            🚀 <strong>Bulk Processing:</strong> Process multiple images simultaneously
                                        </div>
                                        <div style={{ marginBottom: '8px' }}>
                                            ⚡ <strong>High Performance:</strong> Enterprise-grade processing speed
                                        </div>
                                        <div>
                                            🔒 <strong>Secure:</strong> Your images are processed securely
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                    </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .login-container {
                        flex-direction: column !important;
                    }
                    
                    .login-form-side,
                    .login-info-side {
                        min-width: 100% !important;
                        height: auto !important;
                        padding: 40px 20px !important;
                    }
                    
                    .login-form-side {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    .login-info-side {
                        border-left: none !important;
                    }
                    
                    .login-form-container,
                    .login-info-container {
                        max-width: 100% !important;
                    }
                    
                    .login-header,
                    .login-info-header {
                        margin-bottom: 30px !important;
                    }
                    
                    .login-icon,
                    .login-info-icon {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    .login-icon-text,
                    .login-info-icon-text {
                        font-size: 24px !important;
                    }
                    
                    .login-title,
                    .login-info-title {
                        font-size: 24px !important;
                    }
                    
                    .login-subtitle,
                    .login-info-subtitle {
                        font-size: 14px !important;
                    }
                    
                    .demo-account-card {
                        padding: 20px !important;
                        margin-bottom: 16px !important;
                    }
                    
                    .plan-header {
                        margin-bottom: 16px !important;
                    }
                    
                    .plan-icon {
                        font-size: 24px !important;
                        margin-right: 12px !important;
                    }
                    
                    .plan-title {
                        font-size: 18px !important;
                    }
                    
                    .plan-subtitle {
                        font-size: 12px !important;
                    }
                    
                    .use-account-button {
                        height: 44px !important;
                        font-size: 14px !important;
                    }
                    
                    .features-preview {
                        padding: 20px !important;
                    }
                    
                    .features-title {
                        font-size: 18px !important;
                    }
                    
                    .features-content {
                        font-size: 13px !important;
                    }
                }
            `}</style>
        </>
    );
}
