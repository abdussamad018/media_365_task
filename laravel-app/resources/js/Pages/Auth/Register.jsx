import { Head, useForm } from "@inertiajs/react";
import { Button, Select, TextField, Banner } from "@shopify/polaris";
import { useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        subscription_tier: "free",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
    };

    const subscriptionOptions = [
        { label: "🚀 Free - 50 images per request", value: "free" },
        { label: "⚡ Pro - 100 images per request", value: "pro" },
        {
            label: "🏢 Enterprise - 200 images per request",
            value: "enterprise",
        },
    ];

    return (
        <>
            <Head title="Register" />

            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    margin: "0",
                    overflow: "auto",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                {/* Main Container */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1400px",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "row",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "16px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        overflow: "hidden",
                    }}
                    className="register-container"
                >
                    {/* Left Side - Registration Form */}
                    <div
                        style={{
                            flex: "1",
                            minWidth: "500px",

                            padding: "60px 40px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                            borderBottom: "none",
                        }}
                        className="register-form-side"
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "450px",
                            }}
                            className="register-form-container"
                        >
                            {/* Header */}
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "40px",
                                }}
                                className="register-header"
                            >
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        background:
                                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        borderRadius: "50%",
                                        margin: "0 auto 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow:
                                            "0 8px 25px rgba(102, 126, 234, 0.3)",
                                    }}
                                    className="register-icon"
                                >
                                    <span
                                        style={{
                                            color: "white",
                                            fontSize: "32px",
                                            fontWeight: "bold",
                                        }}
                                        className="register-icon-text"
                                    >
                                        🚀
                                    </span>
                                </div>
                                <h1
                                    style={{
                                        fontSize: "28px",
                                        fontWeight: "700",
                                        margin: "0 0 12px 0",
                                        color: "#1e293b",
                                        letterSpacing: "-0.5px",
                                    }}
                                    className="register-title"
                                >
                                    Join the Platform
                                </h1>
                                <p
                                    style={{
                                        color: "#64748b",
                                        margin: "0",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                    }}
                                    className="register-subtitle"
                                >
                                    Start processing your images with
                                    enterprise-grade efficiency
                                </p>
                            </div>

                            {/* Registration Form */}
                            <form
                                onSubmit={handleSubmit}
                                style={{ width: "100%" }}
                            >
                                <div style={{ marginBottom: "24px" }}>
                                    <TextField
                                        label="Full Name"
                                        type="text"
                                        value={data.name}
                                        onChange={(value) =>
                                            setData("name", value)
                                        }
                                        error={errors.name}
                                        autoComplete="name"
                                        required
                                        placeholder="Enter your full name"
                                        labelHidden
                                        prefix="👤"
                                    />
                                </div>

                                <div style={{ marginBottom: "24px" }}>
                                    <TextField
                                        label="Email address"
                                        type="email"
                                        value={data.email}
                                        onChange={(value) =>
                                            setData("email", value)
                                        }
                                        error={errors.email}
                                        autoComplete="email"
                                        required
                                        placeholder="Enter your email"
                                        labelHidden
                                        prefix="📧"
                                    />
                                </div>

                                <div style={{ marginBottom: "24px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontWeight: "600",
                                            color: "#202223",
                                            fontSize: "14px",
                                        }}
                                    >
                                        📋 Subscription Plan
                                    </label>
                                    <Select
                                        label=""
                                        options={subscriptionOptions}
                                        value={data.subscription_tier}
                                        onChange={(value) =>
                                            setData("subscription_tier", value)
                                        }
                                        required
                                    />
                                    {errors.subscription_tier && (
                                        <div
                                            style={{
                                                color: "#d82c0d",
                                                fontSize: "12px",
                                                marginTop: "4px",
                                            }}
                                        >
                                            {errors.subscription_tier}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: "24px" }}>
                                    <TextField
                                        label="Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(value) =>
                                            setData("password", value)
                                        }
                                        error={errors.password}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Enter your password"
                                        labelHidden
                                        prefix="🔒"
                                        connectedRight={
                                            <Button
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                size="slim"
                                                monochrome
                                                outline
                                            >
                                                {showPassword ? "🙈" : "👁️"}
                                            </Button>
                                        }
                                    />
                                </div>

                                <div style={{ marginBottom: "32px" }}>
                                    <TextField
                                        label="Confirm Password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(value) =>
                                            setData(
                                                "password_confirmation",
                                                value
                                            )
                                        }
                                        error={errors.password_confirmation}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Confirm your password"
                                        labelHidden
                                        prefix="✅"
                                        connectedRight={
                                            <Button
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                size="slim"
                                                monochrome
                                                outline
                                            >
                                                {showConfirmPassword
                                                    ? "🙈"
                                                    : "👁️"}
                                            </Button>
                                        }
                                    />
                                </div>

                                {/* Errors */}
                                {Object.keys(errors).length > 0 && (
                                    <div style={{ marginBottom: "24px" }}>
                                        {Object.entries(errors).map(
                                            ([field, error]) => (
                                                <Banner
                                                    key={field}
                                                    status="critical"
                                                    title={`${
                                                        field
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        field.slice(1)
                                                    } Error`}
                                                >
                                                    {error}
                                                </Banner>
                                            )
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
                                        height: "52px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 15px rgba(102, 126, 234, 0.4)",
                                    }}
                                >
                                    {processing
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "32px 0",
                                    color: "#6d7175",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        height: "1px",
                                        background: "#e1e5e9",
                                    }}
                                ></div>
                                <span
                                    style={{
                                        padding: "0 16px",
                                        fontSize: "14px",
                                    }}
                                >
                                    or
                                </span>
                                <div
                                    style={{
                                        flex: 1,
                                        height: "1px",
                                        background: "#e1e5e9",
                                    }}
                                ></div>
                            </div>

                            {/* Sign In Link */}
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "32px",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#6d7175",
                                        margin: "0",
                                        fontSize: "15px",
                                    }}
                                >
                                    Already have an account?{" "}
                                    <a
                                        href="/login"
                                        style={{
                                            color: "#667eea",
                                            textDecoration: "none",
                                            fontWeight: "600",
                                            transition: "color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.color = "#764ba2")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.color = "#667eea")
                                        }
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Platform Info */}
                    <div
                        style={{
                            flex: "1",
                            minWidth: "500px",
                            padding: "60px 40px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            background:
                                "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                            borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                        className="register-info-side"
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "500px",
                            }}
                            className="register-info-container"
                        >
                            {/* Platform Header */}
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "40px",
                                }}
                                className="register-info-header"
                            >
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        background:
                                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        borderRadius: "50%",
                                        margin: "0 auto 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow:
                                            "0 8px 25px rgba(102, 126, 234, 0.3)",
                                    }}
                                    className="register-info-icon"
                                >
                                    <span
                                        style={{
                                            color: "white",
                                            fontSize: "32px",
                                            fontWeight: "bold",
                                        }}
                                        className="register-info-icon-text"
                                    >
                                        🎯
                                    </span>
                                </div>
                                <h2
                                    style={{
                                        fontSize: "28px",
                                        fontWeight: "700",
                                        margin: "0 0 12px 0",
                                        color: "#1e293b",
                                        letterSpacing: "-0.5px",
                                    }}
                                    className="register-info-title"
                                >
                                    Platform Features
                                </h2>
                                <p
                                    style={{
                                        color: "#64748b",
                                        margin: "0",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                    }}
                                    className="register-info-subtitle"
                                >
                                    Discover what makes our platform exceptional
                                </p>
                            </div>

                            {/* Subscription Plans Info */}
                            <div
                                style={{ marginBottom: "32px" }}
                                className="subscription-plans"
                            >
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        color: "#1e293b",
                                        margin: "0 0 20px 0",
                                        textAlign: "center",
                                    }}
                                >
                                    📋 Available Plans
                                </h3>
                                {subscriptionOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "20px",
                                            background:
                                                "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                            marginBottom: "16px",
                                            textAlign: "center",
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.05)",
                                        }}
                                        className="subscription-plan-card"
                                    >
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#1e293b",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Benefits Section */}
                            <div
                                style={{
                                    padding: "24px",
                                    background:
                                        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                                    borderRadius: "16px",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#475569",
                                        margin: "0 0 16px 0",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        textAlign: "center",
                                    }}
                                >
                                    ✨ What You'll Get
                                </p>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: "#64748b",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            background:
                                                "rgba(102, 126, 234, 0.1)",
                                            borderRadius: "8px",
                                            marginBottom: "8px",
                                            border: "1px solid rgba(102, 126, 234, 0.2)",
                                        }}
                                    >
                                        🚀 <strong>Bulk Processing:</strong>{" "}
                                        Process multiple images simultaneously
                                    </div>
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            background:
                                                "rgba(118, 75, 162, 0.1)",
                                            borderRadius: "8px",
                                            marginBottom: "8px",
                                            border: "1px solid rgba(118, 75, 162, 0.2)",
                                        }}
                                    >
                                        ⚡ <strong>High Performance:</strong>{" "}
                                        Enterprise-grade processing speed
                                    </div>
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            background:
                                                "rgba(59, 130, 246, 0.1)",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(59, 130, 246, 0.2)",
                                        }}
                                    >
                                        🔒 <strong>Secure:</strong> Your images
                                        are processed securely
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .register-container {
                        flex-direction: column !important;
                    }

                    .register-form-side,
                    .register-info-side {
                        min-width: 100% !important;
                        height: auto !important;
                        padding: 40px 20px !important;
                    }

                    .register-form-side {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                    }

                    .register-info-side {
                        border-left: none !important;
                    }

                    .register-form-container,
                    .register-info-container {
                        max-width: 100% !important;
                    }

                    .register-header,
                    .register-info-header {
                        margin-bottom: 30px !important;
                    }

                    .register-icon,
                    .register-info-icon {
                        width: 60px !important;
                        height: 60px !important;
                    }

                    .register-icon-text,
                    .register-info-icon-text {
                        font-size: 24px !important;
                    }

                    .register-title,
                    .register-info-title {
                        font-size: 24px !important;
                    }

                    .register-subtitle,
                    .register-info-subtitle {
                        font-size: 14px !important;
                    }

                    .subscription-plan-card {
                        padding: 16px !important;
                        margin-bottom: 12px !important;
                    }

                    .subscription-plan-card > div {
                        font-size: 14px !important;
                    }

                    .benefits-section {
                        padding: 20px !important;
                    }

                    .benefits-section h3 {
                        font-size: 18px !important;
                    }

                    .benefits-section > div {
                        font-size: 13px !important;
                    }
                }
            `}</style>
        </>
    );
}
