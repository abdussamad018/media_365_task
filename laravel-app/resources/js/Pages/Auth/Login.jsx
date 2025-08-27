import { Head, useForm } from '@inertiajs/react';
import { Page, Card, Button, TextField, Banner, Text } from '@shopify/polaris';
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

    const demoAccounts = [
        { 
            tier: 'Free', 
            email: 'free@example.com', 
            password: 'password',
            icon: '🎯',
            color: 'rgba(102, 126, 234, 0.1)',
            borderColor: 'rgba(102, 126, 234, 0.2)',
            textColor: '#667eea'
        },
        { 
            tier: 'Pro', 
            email: 'pro@example.com', 
            password: 'password',
            icon: '⚡',
            color: 'rgba(118, 75, 162, 0.1)',
            borderColor: 'rgba(118, 75, 162, 0.2)',
            textColor: '#764ba2'
        },
        { 
            tier: 'Enterprise', 
            email: 'enterprise@example.com', 
            password: 'password',
            icon: '🏢',
            color: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.2)',
            textColor: '#3b82f6'
        }
    ];

    return (
        <>
            <Head title="Login" />

            <Page title="Welcome Back" subtitle="Sign in to your account">
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0',
                        margin: '0',
                        overflow: 'hidden'
                    }}
                >
                    {/* Main Container */}
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1400px',
                            height: '100vh',
                            display: 'flex',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '0',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Left Side - Login Form */}
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            }}
                        >
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                {/* Header */}
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                                    >
                                        <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                                            🚀
                                        </span>
                                    </div>
                                    <h1
                                        style={{
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            margin: '0 0 12px 0',
                                            color: '#1e293b',
                                            letterSpacing: '-0.5px',
                                        }}
                                    >
                                        Welcome Back
                                    </h1>
                                    <p style={{ 
                                        color: '#64748b', 
                                        margin: '0',
                                        fontSize: '16px',
                                        fontWeight: '400'
                                    }}>
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
                                            autoComplete="email"
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
                                            autoComplete="current-password"
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
                                width: '50%',
                                height: '100%',
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div style={{ width: '100%', maxWidth: '450px' }}>
                                {/* Demo Header */}
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                                    >
                                        <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
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
                                    >
                                        Demo Accounts
                                    </h2>
                                    <p style={{ 
                                        color: '#64748b', 
                                        margin: '0',
                                        fontSize: '16px',
                                        fontWeight: '400'
                                    }}>
                                        Try our platform with these pre-configured accounts
                                    </p>
                                </div>

                                {/* Demo Accounts */}
                                <div style={{ marginBottom: '32px' }}>
                                    {demoAccounts.map((account, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '20px',
                                                background: account.color,
                                                borderRadius: '16px',
                                                border: `1px solid ${account.borderColor}`,
                                                marginBottom: '16px',
                                                position: 'relative',
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{ 
                                                    fontSize: '24px', 
                                                    marginRight: '12px' 
                                                }}>
                                                    {account.icon}
                                                </span>
                                                <Text variant="headingMd" as="h3" style={{
                                                    color: account.textColor,
                                                    fontWeight: '700',
                                                    margin: 0
                                                }}>
                                                    {account.tier} Plan
                                                </Text>
                                            </div>
                                            
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '8px'
                                                }}>
                                                    <span style={{ 
                                                        color: '#64748b', 
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}>
                                                        Email:
                                                    </span>
                                                    <Button
                                                        size="slim"
                                                        monochrome
                                                        outline
                                                        onClick={() => copyToClipboard(account.email, 'Email')}
                                                        style={{
                                                            padding: '4px 8px',
                                                            fontSize: '12px',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        📋 Copy
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    padding: '8px 12px',
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                                    fontFamily: 'monospace',
                                                    fontSize: '13px',
                                                    color: '#1e293b'
                                                }}>
                                                    {account.email}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '8px'
                                                }}>
                                                    <span style={{ 
                                                        color: '#64748b', 
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}>
                                                        Password:
                                                    </span>
                                                    <Button
                                                        size="slim"
                                                        monochrome
                                                        outline
                                                        onClick={() => copyToClipboard(account.password, 'Password')}
                                                        style={{
                                                            padding: '4px 8px',
                                                            fontSize: '12px',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        📋 Copy
                                                    </Button>
                                                </div>
                                                <div style={{
                                                    padding: '8px 12px',
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                                    fontFamily: 'monospace',
                                                    fontSize: '13px',
                                                    color: '#1e293b'
                                                }}>
                                                    {account.password}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Copy Message */}
                                {copyMessage && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '12px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        marginBottom: '20px'
                                    }}>
                                        <Text variant="bodyMd" style={{
                                            color: '#10b981',
                                            fontWeight: '600',
                                            margin: 0
                                        }}>
                                            ✅ {copyMessage}
                                        </Text>
                                    </div>
                                )}

                                {/* Features Preview */}
                                <div style={{
                                    padding: '24px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <Text variant="headingMd" as="h3" style={{
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        margin: '0 0 16px 0'
                                    }}>
                                        ✨ What You'll Get
                                    </Text>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        lineHeight: '1.6'
                                    }}>
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
            </Page>
        </>
    );
}
