import { Head, useForm } from '@inertiajs/react';
import { Page, Card, Button, Select, TextField, Banner } from '@shopify/polaris';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        subscription_tier: 'free',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const subscriptionOptions = [
        { label: '🚀 Free - 50 images per request', value: 'free' },
        { label: '⚡ Pro - 100 images per request', value: 'pro' },
        { label: '🏢 Enterprise - 200 images per request', value: 'enterprise' },
    ];

    return (
        <>
            <Head title="Register" />
            
            <Page title="Create Account" subtitle="Join our bulk thumbnail processing platform">
                <div style={{ 
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '500px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden',
                    }}>
                        {/* Header Section */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '40px 30px 30px',
                            textAlign: 'center',
                            color: 'white',
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}>
                                <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                                    🚀
                                </span>
                            </div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                margin: '0 0 10px 0',
                                color: 'white',
                                letterSpacing: '-0.5px',
                            }}>
                                Join the Platform
                            </h1>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                margin: '0',
                                fontSize: '16px',
                                fontWeight: '400'
                            }}>
                                Start processing your images with enterprise-grade efficiency
                            </p>
                        </div>

                        {/* Form Section */}
                        <div style={{ padding: '40px 30px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '24px' }}>
                                    <TextField
                                        label="Full Name"
                                        type="text"
                                        value={data.name}
                                        onChange={(value) => setData('name', value)}
                                        error={errors.name}
                                        autoComplete="name"
                                        required
                                        placeholder="Enter your full name"
                                        labelHidden
                                        prefix="👤"
                                    />
                                </div>

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

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#202223',
                                        fontSize: '14px'
                                    }}>
                                        📋 Subscription Plan
                                    </label>
                                    <Select
                                        label=""
                                        options={subscriptionOptions}
                                        value={data.subscription_tier}
                                        onChange={(value) => setData('subscription_tier', value)}
                                        required
                                    />
                                    {errors.subscription_tier && (
                                        <div style={{
                                            color: '#d82c0d',
                                            fontSize: '12px',
                                            marginTop: '4px'
                                        }}>
                                            {errors.subscription_tier}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: '24px' }}>
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

                                <div style={{ marginBottom: '32px' }}>
                                    <TextField
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(value) => setData('password_confirmation', value)}
                                        error={errors.password_confirmation}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Confirm your password"
                                        labelHidden
                                        prefix="✅"
                                        connectedRight={
                                            <Button
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                size="slim"
                                                monochrome
                                                outline
                                            >
                                                {showConfirmPassword ? '🙈' : '👁️'}
                                            </Button>
                                        }
                                    />
                                </div>

                                {/* Errors */}
                                {Object.keys(errors).length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        {Object.entries(errors).map(([field, error]) => (
                                            <Banner key={field} status="critical" title={`${field.charAt(0).toUpperCase() + field.slice(1)} Error`}>
                                                {error}
                                            </Banner>
                                        ))}
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
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '32px 0',
                                color: '#6d7175'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: '#e1e5e9' }}></div>
                                <span style={{ padding: '0 16px', fontSize: '14px' }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: '#e1e5e9' }}></div>
                            </div>

                            {/* Sign In Link */}
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <p style={{ color: '#6d7175', margin: '0', fontSize: '15px' }}>
                                    Already have an account?{' '}
                                    <a
                                        href="/login"
                                        style={{
                                            color: '#667eea',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            transition: 'color 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </div>

                            {/* Features Preview */}
                            <div style={{
                                padding: '24px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                            }}>
                                <p style={{
                                    color: '#475569',
                                    margin: '0 0 16px 0',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}>
                                    ✨ What You'll Get
                                </p>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#64748b',
                                    lineHeight: '1.6'
                                }}>
                                    <div style={{
                                        padding: '8px 12px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        border: '1px solid rgba(102, 126, 234, 0.2)'
                                    }}>
                                        🚀 <strong>Bulk Processing:</strong> Process multiple images simultaneously
                                    </div>
                                    <div style={{
                                        padding: '8px 12px',
                                        background: 'rgba(118, 75, 162, 0.1)',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        border: '1px solid rgba(118, 75, 162, 0.2)'
                                    }}>
                                        ⚡ <strong>High Performance:</strong> Enterprise-grade processing speed
                                    </div>
                                    <div style={{
                                        padding: '8px 12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                    }}>
                                        🔒 <strong>Secure:</strong> Your images are processed securely
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
