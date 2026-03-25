import { useState, useRef, useEffect } from 'react';
import {
    Send, Sparkles, Scale, BookOpen, AlertTriangle,
    MessageSquare, ChevronRight, Copy, Plus, Loader2,
    ShieldAlert, Search, RefreshCw, Bookmark, FileText
} from 'lucide-react';
import './LegalAid.css';

const SUGGESTIONS = [
    { text: "What are the rules for filing an Anticipatory Bail under Section 438 CrPC?", icon: ShieldAlert },
    { text: "My landlord is refusing to return my security deposit. What is my legal recourse?", icon: Scale },
    { text: "How do I secure an ex-parte injunction against illegal demolition?", icon: AlertTriangle },
    { text: "Can an FIR be quashed under Section 482 CrPC if the parties compromise?", icon: BookOpen }
];

const LegalAid = () => {
    // 1. STATE ARCHITECTURE
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Complex Loading States
    const [isThinking, setIsThinking] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    /* 0 = parsing, 1 = searching statutes, 2 = generating */

    const messagesEndRef = useRef(null);

    // Auto-scroll to latest intelligence card
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    // 2. QUERY DISPATCH LOOP
    const handleSend = (queryText) => {
        const textToProcess = queryText || inputValue;
        if (!textToProcess.trim()) return;

        // Immediately push User Query Object
        const newUserQuery = {
            id: 'msg_' + Date.now(),
            type: 'user',
            text: textToProcess
        };

        setMessages(prev => [...prev, newUserQuery]);
        setInputValue('');
        setIsThinking(true);
        setLoadingStage(0);

        // 3. MULTI-STAGE NLP SIMULATOR
        setTimeout(() => setLoadingStage(1), 1200);
        setTimeout(() => setLoadingStage(2), 2500);

        setTimeout(() => {
            // MOCK STRUCTURED JSON RESPONSE
            const aiIntelligenceJSON = {
                id: 'ai_' + Date.now(),
                type: 'structured_ai',
                data: {
                    answer: "An Anticipatory Bail under Section 438 of the Criminal Procedure Code (CrPC) can be granted by the High Court or Court of Session. It is a pre-arrest legal remedy invoked when an individual has acute reason to believe they may be arrested on accusation of committing a non-bailable offense.",
                    legal_basis: "Section 438 strictly requires that the apprehension of arrest must be based on tangible, concrete grounds (not a mere 'fear' or 'blanket order'). The court will evaluate the gravity of the offense, the applicant's antecedents, and the possibility of them fleeing from justice.",
                    references: [
                        "Gurbaksh Singh Sibbia v. State of Punjab (1980)",
                        "Sushila Aggarwal v. State (NCT of Delhi) (2020) - 5 Judge Bench"
                    ],
                    insight: "Do not file a vague application. You must explicitly attach the threatening FIR or Complaint. The court may still impose stringent conditions like surrendering passport or explicitly joining the investigation timeframe.",
                    tags: ['CrPC 438', 'Bail', 'High Court']
                }
            };

            setMessages(prev => [...prev, aiIntelligenceJSON]);
            setIsThinking(false);
        }, 4000); // 4-second deep statutorial loop
    };

    return (
        <div className="intelligence-workspace-layout">

            {/* LEFT: NAV STRUCTURAL PRESERVATION */}
            <aside className="intelligence-sidebar">
                <div className="sidebar-header-workspace">
                    <h3>Legal Intelligence</h3>
                </div>
                <div className="sidebar-category-group">
                    <div className="template-item active">
                        <MessageSquare size={18} className="template-icon" />
                        <div><h4>AI Assistant Sandbox</h4></div>
                    </div>
                </div>
            </aside>

            {/* CENTER: MASSIVE RESEARCH FEED */}
            <main className="intelligence-feed-area">

                {/* 1. HEADER & DISCLAIMER */}
                <div className="feed-app-header">
                    <div className="header-titles">
                        <h2>Legal Aid Intelligence</h2>
                        <p>AI-powered legal guidance strictly grounded in primary statutes: IPC, CrPC, CPC, and the Constitution.</p>
                    </div>
                </div>

                <div className="disclaimer-soft-box">
                    <ShieldAlert size={20} className="disclaimer-icon" />
                    <p><strong>Strict Statutory Notice:</strong> This intelligence engine provides jurisdictional analysis mapping and statutory indexing. It does not constitute binding attorney-client representation.</p>
                </div>

                {/* 2. CHAT FEED / CARDS */}
                <div className="intelligence-messages-river">

                    {messages.length === 0 ? (
                        <div className="empty-sandbox-state animate-fade-in">
                            <Sparkles size={48} className="text-primary mb-4 opacity-50 mx-auto" />
                            <h2>How can NyayaSetu analyze your legal issue today?</h2>

                            <div className="suggestion-chips-grid">
                                {SUGGESTIONS.map((sug, idx) => (
                                    <button
                                        key={idx}
                                        className="suggestion-chip"
                                        onClick={() => handleSend(sug.text)}
                                    >
                                        <sug.icon size={18} className="chip-icon" />
                                        <span>{sug.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={"message-wrapper " + (msg.type === 'user' ? 'user-wrapper' : 'ai-wrapper')}>

                                {msg.type === 'user' ? (
                                    <div className="user-query-bubble">
                                        <p>{msg.text}</p>
                                    </div>
                                ) : (
                                    <div className="ai-intelligence-card animate-fade-in">
                                        <div className="card-top-accent"></div>

                                        <div className="ai-card-content">

                                            {/* Section 1: Answer */}
                                            <div className="intelligence-block">
                                                <h4 className="flex items-center gap-2 font-bold mb-2 text-primary">
                                                    <FileText size={16} /> Direct Answer
                                                </h4>
                                                <p>{msg.data.answer}</p>
                                            </div>

                                            {/* Section 2: Statutory Context */}
                                            <div className="intelligence-block border-l-4 border-gray-400 pl-4 py-1">
                                                <h4 className="flex items-center gap-2 font-bold mb-2 text-gray-800">
                                                    <Scale size={16} /> Legal Basis & Statutory Authority
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">{msg.data.legal_basis}</p>
                                            </div>

                                            {/* Section 3: Cited Precedents */}
                                            <div className="intelligence-block blue-tint">
                                                <h4 className="flex items-center gap-2 font-bold mb-2 text-blue-900">
                                                    <BookOpen size={16} /> Binding Precedents Cited
                                                </h4>
                                                <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                                                    {msg.data.references.map((ref, i) => (
                                                        <li key={"ref-" + i}>{ref}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Section 4: Practical Implication */}
                                            <div className="intelligence-block bg-gray-900 text-white rounded-lg p-4">
                                                <h4 className="flex items-center gap-2 font-bold mb-2 text-blue-300 uppercase tracking-wider text-xs">
                                                    <AlertTriangle size={14} /> Actionable Legal Insight
                                                </h4>
                                                <p className="text-sm">{msg.data.insight}</p>
                                            </div>

                                        </div>

                                        {/* Utility Footer */}
                                        <div className="ai-card-footer">
                                            <div className="card-tags-group">
                                                {msg.data.tags.map((tag, i) => (
                                                    <span key={"tag-" + i} className="legal-tag">{tag}</span>
                                                ))}
                                            </div>

                                            <div className="card-quick-actions">
                                                <button className="quick-action-btn"><Copy size={14} /> Copy JSON</button>
                                                <button className="quick-action-btn"><Bookmark size={14} /> Save</button>
                                                <button className="quick-action-btn primary"><Plus size={14} /> Ask Follow-up</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {isThinking && (
                        <div className="message-wrapper ai-wrapper">
                            <div className="ai-spinner-card animate-fade-in">
                                <Loader2 size={24} className="spin text-primary mr-3" />
                                <span className="spinner-text">
                                    {loadingStage === 0 && "Parsing query terminology..."}
                                    {loadingStage === 1 && "Cross-referencing statutory databases (CrPC/IPC)..."}
                                    {loadingStage === 2 && "Compiling legal precedents and actionable insights..."}
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 3. MASSIVE INPUT ASSEMBLY */}
                <div className="huge-input-assembly">
                    <div className="search-bar-wrapper">
                        <Search size={22} className="input-search-icon" />
                        <input
                            type="text"
                            className="massive-legal-input"
                            placeholder="Ask an advanced statutory query regarding IPC, bail mechanics, or constitutional rights..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                        />
                        <button
                            className={"massive-send-btn " + (inputValue.trim() ? 'active' : '')}
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="input-footnote">
                        <ShieldAlert size={12} /> Ensure confidential names or PII are obfuscated before querying the index.
                    </div>
                </div>

            </main>
        </div>
    );
};

export default LegalAid;
