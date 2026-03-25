import { useState, useEffect } from 'react';
import {
    Search, Filter, BookOpen, Clock, Gavel, Calendar, FileText,
    ChevronRight, X, Sparkles, TrendingUp, AlertCircle, ChevronDown
} from 'lucide-react';
import './CaseFinder.css';

const DUMMY_CASES = [
    {
        id: 1,
        title: "Justice K. S. Puttaswamy (Retd.) and Anr. vs Union Of India And Ors.",
        citation: "(2017) 10 SCC 1",
        date: "August 24, 2017",
        bench: "9 Judges",
        court: "Supreme Court",
        category: "Constitutional",
        sections: "Art. 14, 19, 21",
        aiSummary: "Landmark judgment establishing the right to privacy as a fundamental right protected under Part III of the Constitution.",
        fullSummary: "The Supreme Court unanimously held that the right to privacy is a fundamental right. It overruled previous judgments in M.P. Sharma and Kharak Singh which had held otherwise. The Court recognized that privacy is intrinsic to the right to life and liberty under Article 21 and forms the core of human dignity.",
        arguments: [
            "Petitioners argued privacy is essential for democratic functioning.",
            "State argued privacy is an elitist concept not found in the Constitution."
        ]
    },
    {
        id: 2,
        title: "Navtej Singh Johar & Ors. vs Union of India",
        citation: "(2018) 10 SCC 1",
        date: "September 6, 2018",
        bench: "5 Judges",
        court: "Supreme Court",
        category: "Criminal",
        sections: "IPC 377, Art. 14",
        aiSummary: "Decriminalized all consensual adult sex, reading down Section 377 of the IPC.",
        fullSummary: "The Constitution Bench unanimously read down Section 377 of the Indian Penal Code, stating that it criminalizes consensual sexual acts between adults in private. The Court held it violates Articles 14, 15, 19, and 21 of the Constitution, emphasizing that sexual orientation is an essential attribute of privacy and dignity.",
        arguments: [
            "Section 377 targets a specific minority and violates equality.",
            "Public morality cannot override constitutional morality."
        ]
    },
    {
        id: 3,
        title: "Tata Consultancy Services vs State of Andhra Pradesh",
        citation: "(2004) 271 ITR 401",
        date: "November 4, 2004",
        bench: "5 Judges",
        court: "Supreme Court",
        category: "Commercial",
        sections: "Sales Tax Act",
        aiSummary: "Held that software programs are classified as 'goods' for the purpose of sales tax.",
        fullSummary: "The Court ruled that both branded and unbranded software are goods under the Sales Tax Act. Intellectual property, once put onto a physical medium and marketed, becomes a 'good'. It is capable of being bought, sold, transmitted, and physically possessed.",
        arguments: [
            "Software is intangible intellectual property, not a physical good.",
            "Once programmed onto a medium (CD/disk), it acquires physical attributes."
        ]
    }
];

const SUGGESTIONS = [
    "Breach of specific performance",
    "Arbitration award challenges",
    "Section 138 NI Act"
];

const CaseFinder = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const [searchCategory, setSearchCategory] = useState('All Sources');

    // Filters
    const [activeCourt, setActiveCourt] = useState('All Courts');
    const [activeYear, setActiveYear] = useState('All Years');

    // Simulate Search Execution
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setHasSearched(false);
        // Simulate network delay for AI querying
        setTimeout(() => {
            setIsSearching(false);
            setHasSearched(true);
        }, 1200);
    };

    // Auto-search via suggestions
    const triggerSearch = (query) => {
        setSearchQuery(query);
        setIsSearching(true);
        setHasSearched(false);
        setTimeout(() => {
            setIsSearching(false);
            setHasSearched(true);
        }, 1200);
    };

    return (
        <div className="research-layout">
            {/* L: FILTERS SIDEBAR */}
            <aside className="filters-sidebar">
                <div className="filter-header">
                    <h3>Refine Search</h3>
                    <button className="clear-btn">Clear All</button>
                </div>

                <div className="filter-group">
                    <label>Jurisdiction</label>
                    <div className="custom-select">
                        <select value={activeCourt} onChange={e => setActiveCourt(e.target.value)}>
                            <option>All Courts</option>
                            <option>Supreme Court of India</option>
                            <option>Delhi High Court</option>
                            <option>Bombay High Court</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Timeline</label>
                    <div className="custom-select">
                        <select value={activeYear} onChange={e => setActiveYear(e.target.value)}>
                            <option>All Years</option>
                            <option>2023 - Present</option>
                            <option>2010 - 2022</option>
                            <option>Pre-2010</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Area of Law</label>
                    <div className="checkbox-list">
                        <label className="checkbox-item"><input type="checkbox" defaultChecked /> <span>Constitutional Law</span></label>
                        <label className="checkbox-item"><input type="checkbox" defaultChecked /> <span>Criminal Law</span></label>
                        <label className="checkbox-item"><input type="checkbox" /> <span>Corporate Law</span></label>
                        <label className="checkbox-item"><input type="checkbox" /> <span>Family Law</span></label>
                    </div>
                </div>
            </aside>

            {/* R: RESULTS FEED */}
            <main className={`results-feed ${selectedCase ? 'panel-open' : ''}`}>
                <div className="search-header-panel">
                    <form className="advanced-search-bar" onSubmit={handleSearch}>
                        <div className="search-category-dropdown">
                            <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                                <option>All Sources</option>
                                <option>Case Law</option>
                                <option>Statutes (Bare Acts)</option>
                                <option>Drafts</option>
                            </select>
                            <ChevronDown size={14} className="category-icon" />
                        </div>
                        <div className="search-input-area">
                            <Search size={18} className="search-icon text-secondary" />
                            <input
                                type="text"
                                placeholder="Describe the legal issue or cite a case (e.g. damages for breach of contract)..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="unified-search-btn">
                            Analyze
                        </button>
                    </form>

                    {!hasSearched && !isSearching && (
                        <div className="trending-searches">
                            <span className="trending-label"><TrendingUp size={14} /> Trending Queries:</span>
                            {SUGGESTIONS.map((s, i) => (
                                <span key={i} className="trending-tag" onClick={() => triggerSearch(s)}>{s}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="feed-content">
                    {/* SKELETON LOADER */}
                    {isSearching && (
                        <div className="skeleton-container">
                            <div className="skeleton-summary">
                                <div className="skeleton-box title-skel mb-2"></div>
                                <div className="skeleton-box line-skel w-80 mb-1"></div>
                                <div className="skeleton-box line-skel w-60"></div>
                            </div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton-card">
                                    <div className="skeleton-box title-skel mb-3 w-70"></div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="skeleton-box badge-skel"></div>
                                        <div className="skeleton-box badge-skel"></div>
                                    </div>
                                    <div className="skeleton-box line-skel mb-2 w-90"></div>
                                    <div className="skeleton-box line-skel w-80"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ACTUAL RESULTS + AI SUMMARY */}
                    {hasSearched && !isSearching && (
                        <div className="results-display animate-fade-in">
                            {/* AI Summary Banner */}
                            <div className="ai-summary-banner glass-panel">
                                <div className="ai-banner-header">
                                    <Sparkles size={18} className="text-primary glow-icon" />
                                    <h4>AI Research Synthesis</h4>
                                </div>
                                <p>
                                    Based on your query, courts consistently prioritize the <strong>Basic Structure Doctrine</strong> and <strong>Article 21</strong> when interpreting fundamental rights. Recent trends show a heavy reliance on <em>Puttaswamy v. Union of India</em> to expand privacy vectors in digital and physical realms.
                                </p>
                                <div className="key-statute-tags">
                                    <span>Key Statutes: Constitution of India Art. 21</span>
                                    <span>IPC Sec. 377</span>
                                </div>
                            </div>

                            <p className="results-count">Showing 3 top precedents for "{searchQuery}"</p>

                            {/* Case Cards */}
                            <div className="case-list">
                                {DUMMY_CASES.map(c => (
                                    <div key={c.id} className="case-card glass-panel" onClick={() => setSelectedCase(c)}>
                                        <div className="case-card-header">
                                            <h3>{c.title}</h3>
                                            <span className="case-citation">{c.citation}</span>
                                        </div>

                                        <div className="case-meta">
                                            <span className="meta-tag"><Gavel size={14} /> {c.court} ({c.bench})</span>
                                            <span className="meta-tag"><Calendar size={14} /> {c.date}</span>
                                            <span className="meta-tag highlight-sections"><BookOpen size={14} /> {c.sections}</span>
                                        </div>

                                        <div className="case-ai-snippet">
                                            <div className="snippet-marker"></div>
                                            <p>{c.aiSummary}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EMPTY INITIAL STATE */}
                    {!hasSearched && !isSearching && (
                        <div className="empty-search-state animate-fade-in">
                            <BookOpen size={48} className="empty-icon" />
                            <h2>Intelligent Case Finder</h2>
                            <p>Enter a query above to let NyayaSetu analyze 50M+ judgments, cross-reference statutes, and extract critical arguments instantly.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* SLIDE-OUT DETAIL PANEL */}
            <div className={`side-panel-overlay ${selectedCase ? 'visible' : ''}`} onClick={() => setSelectedCase(null)}></div>
            <div className={`case-detail-panel ${selectedCase ? 'open' : ''}`}>
                {selectedCase && (
                    <>
                        <div className="detail-panel-header">
                            <div>
                                <h2>{selectedCase.title}</h2>
                                <span className="citation-badge">{selectedCase.citation}</span>
                            </div>
                            <button className="close-panel-btn" onClick={() => setSelectedCase(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="detail-panel-body">
                            <div className="detail-section">
                                <h4><AlertCircle size={16} /> Essential Summary</h4>
                                <p className="leading-relaxed">{selectedCase.fullSummary}</p>
                            </div>

                            <div className="detail-section">
                                <h4><Gavel size={16} /> Primary Arguments Highlighted</h4>
                                <ul className="arguments-list">
                                    {selectedCase.arguments.map((arg, idx) => (
                                        <li key={idx}><ChevronRight size={14} className="list-icon" /> {arg}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4><FileText size={16} /> Bench Details</h4>
                                <p><strong>Court:</strong> {selectedCase.court}</p>
                                <p><strong>Bench Size:</strong> {selectedCase.bench}</p>
                                <p><strong>Date of Judgment:</strong> {selectedCase.date}</p>
                                <p><strong>Category:</strong> {selectedCase.category}</p>
                            </div>
                        </div>

                        <div className="detail-panel-footer">
                            <button className="primary-btn w-full">Ask AI About This Case</button>
                            <button className="secondary-btn w-full mt-3 text-center justify-center">Read Full Judgment PDF</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CaseFinder;
