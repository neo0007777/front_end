import { useState, useRef } from 'react';
import {
    UploadCloud, X, Plus, FileText, AlertTriangle,
    ShieldAlert, Loader2, Sparkles, AlertCircle, FileSearch, ArrowRight
} from 'lucide-react';
import './ClauseConflict.css';

const ClauseConflict = () => {
    // 1. DYNAMIC M-to-N STATE ARCHITECTURE
    const [parties, setParties] = useState([
        { id: 'party-1', name: 'Party 1', files: [] },
        { id: 'party-2', name: 'Party 2', files: [] }
    ]);

    // 2. ANALYSIS STATES
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);

    // ============================================
    // PARTY MANAGEMENT METHODS
    // ============================================
    const handleAddParty = () => {
        const newId = `party-${Date.now()}`;
        const newName = `Party ${parties.length + 1}`;
        setParties([...parties, { id: newId, name: newName, files: [] }]);
    };

    const handleRemoveParty = (idToRemove) => {
        if (parties.length <= 2) return; // Enforce minimum 2 parties

        // Re-index remaining party names sequentially
        const updatedParties = parties
            .filter(p => p.id !== idToRemove)
            .map((p, idx) => ({ ...p, name: `Party ${idx + 1}` }));

        setParties(updatedParties);
    };

    const updatePartyName = (id, newName) => {
        setParties(parties.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    // ============================================
    // FILE MANAGEMENT METHODS 
    // ============================================
    const fileInputRefs = useRef({});

    const handleFileUpload = (e, partyId) => {
        const uploadedFiles = Array.from(e.target.files);
        if (uploadedFiles.length === 0) return;

        // Map native File objects to mock metadata representing PDF docs
        const mappedFiles = uploadedFiles.map(file => ({
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setParties(parties.map(p => {
            if (p.id === partyId) {
                return { ...p, files: [...p.files, ...mappedFiles] };
            }
            return p;
        }));

        // Reset the specific input so the exact same file can be uploaded again if needed
        if (fileInputRefs.current[partyId]) {
            fileInputRefs.current[partyId].value = null;
        }
    };

    const handleRemoveFile = (partyId, fileId) => {
        setParties(parties.map(p => {
            if (p.id === partyId) {
                return { ...p, files: p.files.filter(f => f.id !== fileId) };
            }
            return p;
        }));
    };

    // ============================================
    // ANALYSIS LOGIC
    // ============================================
    // Ensure at least 2 distinct parties legitimately possess files
    const validParties = parties.filter(p => p.files.length > 0);
    const canAnalyze = validParties.length >= 2;

    const triggerConflictAnalysis = () => {
        if (!canAnalyze) return;
        setIsAnalyzing(true);
        setAnalysisResults(null);

        // Simulate complex NLP graph analysis across M*N dimensions
        setTimeout(() => {

            // Build mock dynamic conflict arrays based on the specific files uploaded
            const mockConflicts = [];

            // Just pair up Party 1 and Party 2 explicitly for demo purposes
            const p1 = validParties[0];
            const p2 = validParties[1];

            if (p1 && p2) {
                mockConflicts.push({
                    id: 'c1',
                    partyA: p1.name,
                    partyAFile: p1.files[0]?.name || 'Base Contract.pdf',
                    partyAClause: "Liability is strictly capped at 20% of the aggregate retainer fees.",
                    partyB: p2.name,
                    partyBFile: p2.files[0]?.name || 'Supplier Addendum.pdf',
                    partyBClause: "The Supplier maintains uncapped strict liability for all catastrophic damages resulting from operational negligence.",
                    severity: 'High',
                    implication: "Direct monetary contradiction. In the event of catastrophic negligence, Party 2's addendum claims uncapped damages while Party 1 restricts it to 20% retainer."
                });

                mockConflicts.push({
                    id: 'c2',
                    partyA: p1.name,
                    partyAFile: p1.files[0]?.name || 'Base Contract.pdf',
                    partyAClause: "Governing law shall be the strict jurisdiction of the Hon'ble High Court of New Delhi.",
                    partyB: p2.name,
                    partyBFile: p2.files[0]?.name || 'Supplier Addendum.pdf',
                    partyBClause: "All arbitrary disputes are subject to the exclusive local jurisdiction of the Judicial Magistrate, Mumbai.",
                    severity: 'Medium',
                    implication: "Jurisdictional contradiction. Initiating a lawsuit will trigger a baseline territorial dispute under Section 20 CPC before merits are even heard."
                });
            }

            // If they uploaded more than 2, generate an M-to-N cross conflict
            if (validParties.length > 2) {
                const p3 = validParties[2];
                mockConflicts.push({
                    id: 'c3',
                    partyA: p1.name,
                    partyAFile: p1.files[0]?.name || 'Base Contract.pdf',
                    partyAClause: "Termination requires a rigid 90-day explicit written notice.",
                    partyB: p3.name,
                    partyBFile: p3.files[0]?.name || 'Sub-contractor Deed.pdf',
                    partyBClause: "The primary vendor may be terminated immediately upon 24-hour electronic notice.",
                    severity: 'High',
                    implication: `Procedural conflict between ${p1.name} and ${p3.name}. If the Master contract requires 90 days, executing the 24-hour termination deed violates the master continuity clause.`
                });
            }

            setAnalysisResults(mockConflicts);
            setIsAnalyzing(false);
        }, 3000); // 3 second dramatic loading
    };

    const getSeverityIcon = (level) => {
        if (level === 'High') return <AlertOctagon size={18} className="text-red-500" />;
        if (level === 'Medium') return <AlertTriangle size={18} className="text-amber-500" />;
        return <AlertCircle size={18} className="text-blue-500" />;
    };

    const getSeverityBadgeClass = (level) => {
        if (level === 'High') return 'badge-high';
        if (level === 'Medium') return 'badge-medium';
        return 'badge-low';
    };

    return (
        <div className="conflict-workspace-layout">

            {/* TOP HEADER */}
            <header className="conflict-header-premium">
                <div className="header-icon-wrapper">
                    <ShieldAlert size={28} className="text-primary" />
                </div>
                <div className="header-text-block">
                    <h2>Multi-Party Matrix Analyzer</h2>
                    <p>Detect contradicting liabilities, jurisdictional disputes, and mismatched indemnifications across an unlimited array of foundational PDF documents.</p>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="conflict-main-content">

                {/* STATE 1: Data Architecture & Upload Rings */}
                {!isAnalyzing && !analysisResults && (
                    <div className="upload-matrix-stage animate-fade-in">

                        <div className="party-cards-grid">
                            {parties.map((party, index) => (
                                <div key={party.id} className="party-card-premium">
                                    <div className="party-card-header">
                                        <input
                                            type="text"
                                            value={party.name}
                                            onChange={(e) => updatePartyName(party.id, e.target.value)}
                                            className="party-name-input"
                                            placeholder="Enter Party Name..."
                                        />
                                        {parties.length > 2 && (
                                            <button
                                                className="remove-party-btn"
                                                onClick={() => handleRemoveParty(party.id)}
                                                title="Remove this party"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Upload Zone */}
                                    <div
                                        className="party-upload-zone"
                                        onClick={() => fileInputRefs.current[party.id]?.click()}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.docx,.doc"
                                            className="hidden-file-input"
                                            ref={(el) => fileInputRefs.current[party.id] = el}
                                            onChange={(e) => handleFileUpload(e, party.id)}
                                        />
                                        <UploadCloud size={32} className="upload-icon-faded" />
                                        <p>Click to browse documents</p>
                                        <span className="upload-subtext">PDF, DOCX accepted</span>
                                    </div>

                                    {/* Uploaded Files Manifest */}
                                    {party.files.length > 0 && (
                                        <div className="party-files-list">
                                            {party.files.map(file => (
                                                <div key={file.id} className="uploaded-file-row">
                                                    <FileText size={16} className="text-primary" />
                                                    <span className="file-name-truncate">{file.name}</span>
                                                    <button
                                                        className="remove-file-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent opening upload dialog when clicking X
                                                            handleRemoveFile(party.id, file.id);
                                                        }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Party & Trigger Control Strip */}
                        <div className="matrix-controls-strip">
                            <button className="add-party-ghost-btn" onClick={handleAddParty}>
                                <Plus size={18} /> Add New Contracting Party
                            </button>

                            <button
                                className={`analyze-matrix-btn ${canAnalyze ? 'active' : 'disabled'}`}
                                onClick={triggerConflictAnalysis}
                                disabled={!canAnalyze}
                            >
                                <Sparkles size={20} />
                                {canAnalyze ? `Cross-Analyse ${validParties.length} Parties` : `Upload files to at least 2 parties`}
                            </button>
                        </div>
                    </div>
                )}

                {/* STATE 2: AI Spinner Matrix */}
                {isAnalyzing && (
                    <div className="matrix-loading-state animate-fade-in">
                        <div className="spinner-ring">
                            <Loader2 size={56} className="spin text-primary" />
                        </div>
                        <h3>Semantic Matrix Analysis Running</h3>
                        <p className="loading-stage-text">Cross-referencing `{validParties.map(p => p.name).join(' vs ')}` arrays for legal contradiction...</p>
                    </div>
                )}

                {/* STATE 3: Resolved Conflict Grid */}
                {!isAnalyzing && analysisResults && (
                    <div className="matrix-results-stage animate-fade-in">

                        <div className="results-header-actions">
                            <h3><FileSearch size={22} className="text-primary inline mr-2" /> Conflict Analysis Complete</h3>
                            <button className="reset-matrix-btn" onClick={() => setAnalysisResults(null)}>
                                Configure Matrix
                            </button>
                        </div>

                        <div className="results-metrics-strip">
                            <div className="metric-box">
                                <span className="metric-value">{analysisResults.length}</span>
                                <span className="metric-label">Total Clauses Flagged</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-value text-red-600">
                                    {analysisResults.filter(c => c.severity === 'High').length}
                                </span>
                                <span className="metric-label">High Severity</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-value">{validParties.length}</span>
                                <span className="metric-label">Parties Compared</span>
                            </div>
                        </div>

                        <div className="conflicts-feed">
                            {analysisResults.map(conflict => (
                                <div key={conflict.id} className="conflict-result-card">

                                    <div className="conflict-result-header">
                                        <div className="conflict-party-badge">
                                            {conflict.partyA} vs {conflict.partyB}
                                        </div>
                                        <div className={`severity-badge ${getSeverityBadgeClass(conflict.severity)}`}>
                                            {conflict.severity === 'High' && <ShieldAlert size={14} />}
                                            {conflict.severity === 'Medium' && <AlertTriangle size={14} />}
                                            {conflict.severity} Severity
                                        </div>
                                    </div>

                                    <div className="conflict-clauses-split">
                                        {/* Left Side clause A */}
                                        <div className="clause-box">
                                            <span className="clause-source-label">From: {conflict.partyAFile}</span>
                                            <p className="clause-text">"{conflict.partyAClause}"</p>
                                        </div>

                                        {/* Center indicator */}
                                        <div className="clause-divider-icon">
                                            <ArrowRight size={24} className="text-red-500 mx-2" />
                                        </div>

                                        {/* Right Side clause B */}
                                        <div className="clause-box red-tint">
                                            <span className="clause-source-label">From: {conflict.partyBFile}</span>
                                            <p className="clause-text">"{conflict.partyBClause}"</p>
                                        </div>
                                    </div>

                                    <div className="conflict-implication-box">
                                        <h4>Legal Implication:</h4>
                                        <p>{conflict.implication}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
};

export default ClauseConflict;
