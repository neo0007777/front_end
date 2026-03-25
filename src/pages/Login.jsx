import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Extrapolate login logic from Global Context
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="login-matrix">
            <div className="login-graphic-panel">
                <div className="logo-vertical">
                    <Shield size={64} className="text-blue-500 mb-4" />
                    <h1>NyayaSetu</h1>
                    <p>Enterprise Legal Intelligence</p>
                </div>

                <div className="graphic-features">
                    <div className="graphic-item">
                        <div className="g-icon"><Lock size={18} /></div>
                        <span>End-to-end 256-bit Document Encryption</span>
                    </div>
                </div>
            </div>

            <div className="login-interactive-panel">
                <div className="login-card">
                    <h2>Welcome back</h2>
                    <p className="login-subtitle">Enter your robust credentials to access the workspace.</p>

                    {error && (
                        <div className="login-error-flag animate-fade-in">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="shiva.sharma@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label>Password</label>
                                <a href="#/" className="forgot-pwd">Forgot password?</a>
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : (
                                <>Sign in to Interface <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an enterprise account? <a href="#/">Request Access</a></p>

                        <div className="test-credentials">
                            <strong>Testing Payload:</strong><br />
                            Email: <code>shiva.sharma@example.com</code><br />
                            Password: <code>securepassword123</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
