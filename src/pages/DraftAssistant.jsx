import { useState, useRef } from 'react';
import {
    FileText, Wand2, RotateCcw, Download, Copy, RefreshCw, Edit3,
    Bold, Italic, AlignLeft, AlignCenter, AlignJustify, Sparkles,
    CornerDownRight, Check, Loader2, ShieldAlert, AlertOctagon,
    Scale, BookmarkMinus, Briefcase, Users, Lock, FileSignature, FileEdit,
    UploadCloud, X, AlertTriangle, ListChecks, ArrowRightCircle
} from 'lucide-react';
import './DraftAssistant.css';

// 1. MASSIVE TEMPLATE DIRECTORY (Grouped by Category)
const TEMPLATE_GROUPS = [
    {
        groupTitle: 'CUSTOM ANALYSIS',
        templates: [
            {
                id: 'custom_upload',
                title: 'Upload Your Draft',
                icon: UploadCloud,
                fields: [],
                suggestionRefs: [],
                generateDraft: () => ''
            }
        ]
    },
    {
        groupTitle: 'CRIMINAL',
        templates: [
            {
                id: 'bail',
                title: 'Bail Application',
                icon: ShieldAlert,
                fields: [
                    { id: 'accused', label: 'Name of Accused', placeholder: 'e.g. Ramesh Kumar' },
                    { id: 'fir', label: 'FIR No. / Year', placeholder: 'e.g. 124/2023' },
                    { id: 'sections', label: 'Relevant Sections', placeholder: 'e.g. 302, 307 IPC' },
                    { id: 'court', label: 'Jurisdiction / Court', placeholder: 'e.g. Sessions Court, Delhi' },
                    { id: 'facts', label: 'Brief Defense Facts', placeholder: 'e.g. Falsely implicated...', type: 'textarea' }
                ],
                suggestionRefs: ['bail_arnesh', 'bail_flight'],
                generateDraft: (data) => "IN THE COURT OF " + (data.court?.toUpperCase() || '[COURT]') + "\n\nIN THE MATTER OF:\nState vs. " + (data.accused || '[ACCUSED]') + "\nFIR No.: " + (data.fir || '[FIR]') + "\nU/s: " + (data.sections || '[SECTIONS]') + "\n\nAPPLICATION UNDER SECTION 439 OF THE CrPC FOR GRANT OF REGULAR BAIL\n\nMOST RESPECTFULLY SHOWETH:\n1. That the applicant/accused was arrested recently and has been in judicial custody.\n2. That the allegations made in the FIR are entirely false and concocted.\n3. Briefly stated, the true facts are: " + (data.facts || '[DEFENSE FACTS]') + "\n4. That the applicant is a respectable citizen with deep roots in society and no prior criminal antecedents.\n\nPRAYER:\nIn view of the facts stated above, it is prayed that this Hon'ble Court may be pleased to grant regular bail to the applicant.\n\nPLACE: \nDATE: 26-03-2026\n\nADVOCATE FOR THE APPLICANT"
            },
            {
                id: 'anticipatory',
                title: 'Anticipatory Bail',
                icon: AlertOctagon,
                fields: [
                    { id: 'apprehended', label: 'Name of Person', placeholder: 'e.g. Suresh Singh' },
                    { id: 'ps', label: 'Police Station', placeholder: 'e.g. Vasant Kunj' },
                    { id: 'offense', label: 'Apprehended Offense', placeholder: 'e.g. 498A IPC' },
                    { id: 'court', label: 'Jurisdiction / Court', placeholder: 'e.g. High Court of Delhi' },
                    { id: 'reasons', label: 'Reasons for Apprehension', placeholder: 'e.g. Matrimonial dispute threats...', type: 'textarea' }
                ],
                suggestionRefs: ['anticipatory_cooperate', 'anticipatory_blanket'],
                generateDraft: (data) => "IN THE " + (data.court?.toUpperCase() || '[COURT]') + "\n\nIN THE MATTER OF:\n" + (data.apprehended || '[NAME]') + " vs. State\nP.S.: " + (data.ps || '[POLICE STATION]') + "\nApprehended U/s: " + (data.offense || '[SECTIONS]') + "\n\nAPPLICATION UNDER SECTION 438 OF THE CrPC FOR GRANT OF ANTICIPATORY BAIL\n\nMOST RESPECTFULLY SHOWETH:\n1. That the applicant apprehends arrest by the police in a non-bailable offense.\n2. That the apprehension stems from: " + (data.reasons || '[REASONS]') + "\n3. That the applicant is innocent and has been falsely implicated to harass him.\n\nPRAYER:\nIt is prayed that in the event of arrest, the applicant be released on anticipatory bail.\n\nADVOCATE FOR THE APPLICANT"
            },
            {
                id: 'fir',
                title: 'FIR Complaint',
                icon: FileEdit,
                fields: [
                    { id: 'complainant', label: 'Complainant Name', placeholder: 'e.g. Amit Patel' },
                    { id: 'sho', label: 'To (SHO/PS)', placeholder: 'e.g. SHO, Saket PS' },
                    { id: 'date', label: 'Date of Incident', placeholder: 'e.g. 12-03-2026' },
                    { id: 'subject', label: 'Subject', placeholder: 'e.g. Theft of Vehicle' },
                    { id: 'incident', label: 'Incident Details', placeholder: 'e.g. At 10 PM, my car was...', type: 'textarea' }
                ],
                suggestionRefs: ['fir_cctv', 'fir_delay'],
                generateDraft: (data) => "To,\nThe Station House Officer (SHO),\n" + (data.sho || '[POLICE STATION]') + "\n\nSubject: Complaint regarding " + (data.subject || '[SUBJECT]') + ".\n\nRespected Sir/Madam,\nI, " + (data.complainant || '[NAME]') + ", wish to register a formal complaint regarding an incident that occurred on " + (data.date || '[DATE]') + ".\n\nDetails of the incident:\n" + (data.incident || '[INCIDENT DETAILS]') + "\n\nI request you to kindly register an FIR immediately under the relevant penal provisions and initiate swift investigation.\n\nYours faithfully,\n\n" + (data.complainant || '[NAME]') + "\n[Contact Info]"
            }
        ]
    },
    {
        groupTitle: 'CIVIL',
        templates: [
            {
                id: 'plaint',
                title: 'Plaint / Civil Suit',
                icon: Scale,
                fields: [
                    { id: 'plaintiff', label: 'Plaintiff Name', placeholder: 'e.g. ABC Corp.' },
                    { id: 'defendant', label: 'Defendant Name', placeholder: 'e.g. XYZ Ltd.' },
                    { id: 'court', label: 'Jurisdiction', placeholder: 'e.g. District Court, Mumbai' },
                    { id: 'suitValue', label: 'Suit Valuation', placeholder: 'e.g. Rs. 50,00,000/-' },
                    { id: 'cause', label: 'Cause of Action', placeholder: 'e.g. Breach of contract on...', type: 'textarea' }
                ],
                suggestionRefs: ['civil_jurisdiction', 'civil_limitation'],
                generateDraft: (data) => "IN THE COURT OF " + (data.court?.toUpperCase() || '[COURT]') + "\nCivil Suit No. ___ of 2026\n\nBETWEEN:\n" + (data.plaintiff || '[PLAINTIFF]') + " ... PLAINTIFF\nAND\n" + (data.defendant || '[DEFENDANT]') + " ... DEFENDANT\n\nSUIT FOR RECOVERY OF MONEY / DECLARATION\n\nThe Plaintiff respectfully submits as under:\n1. That the Plaintiff is a registered entity carrying on lawful business.\n2. That the Cause of Action arose when: " + (data.cause || '[CAUSE OF ACTION]') + ".\n3. That the suit is valued at " + (data.suitValue || '[VALUE]') + " for the purpose of jurisdiction and court fees.\n\nPRAYER:\nThe Plaintiff prays for a decree in their favor and against the Defendant.\n\nPLAINTIFF"
            },
            {
                id: 'injunction',
                title: 'Injunction Application',
                icon: BookmarkMinus,
                fields: [
                    { id: 'applicant', label: 'Applicant Name', placeholder: 'e.g. Rahul Verma' },
                    { id: 'respondent', label: 'Respondent Name', placeholder: 'e.g. Municipal Corp.' },
                    { id: 'court', label: 'Court Name', placeholder: 'e.g. Civil Judge, Bangalore' },
                    { id: 'property', label: 'Suit Property / Subject', placeholder: 'e.g. Plot No. 42, Sector 5' },
                    { id: 'urgency', label: 'Grounds of Urgency', placeholder: 'e.g. Illegal demolition starting...', type: 'textarea' }
                ],
                suggestionRefs: ['injunction_prima', 'injunction_balance'],
                generateDraft: (data) => "IN THE COURT OF " + (data.court?.toUpperCase() || '[COURT]') + "\n\nIN THE MATTER OF:\n" + (data.applicant || '[APPLICANT]') + " vs. " + (data.respondent || '[RESPONDENT]') + "\n\nAPPLICATION UNDER ORDER 39 RULES 1 & 2 OF CPC FOR AD-INTERIM INJUNCTION\n\nMOST RESPECTFULLY SHOWETH:\n1. That the Plaintiff has filed the accompanying suit concerning " + (data.property || '[PROPERTY]') + ".\n2. That there is extreme urgency because: " + (data.urgency || '[GROUNDS OF URGENCY]') + ".\n3. That the Plaintiff has a prima facie case, and the balance of convenience lies in their favor.\n\nPRAYER:\nIt is prayed to grant an ad-interim ex-parte injunction restraining the Defendant.\n\nAPPLICANT"
            }
        ]
    },
    {
        groupTitle: 'CONTRACTS',
        templates: [
            {
                id: 'rent',
                title: 'Rent Agreement',
                icon: Briefcase,
                fields: [
                    { id: 'landlord', label: 'Landlord Name', placeholder: 'e.g. Sunil Gupta' },
                    { id: 'tenant', label: 'Tenant Name', placeholder: 'e.g. Priya Sharma' },
                    { id: 'property', label: 'Property Address', placeholder: 'e.g. Flat 101, A-Wing...' },
                    { id: 'rent', label: 'Monthly Rent', placeholder: 'e.g. Rs. 25,000/-' },
                    { id: 'duration', label: 'Duration', placeholder: 'e.g. 11 Months' }
                ],
                suggestionRefs: ['contract_lockin', 'contract_maintenance'],
                generateDraft: (data) => "RENT AGREEMENT\n\nThis Rent Agreement is made on this day between:\n" + (data.landlord || '[LANDLORD]') + " (Hereinafter called the 'Lessor')\nAND\n" + (data.tenant || '[TENANT]') + " (Hereinafter called the 'Lessee')\n\nWHEREAS the Lessor is the absolute owner of " + (data.property || '[PROPERTY]') + ".\n\nNOW THIS DEED WITNESSETH AS UNDER:\n1. That the tenancy shall be for a period of " + (data.duration || '[DURATION]') + ".\n2. That the Lessee shall pay a monthly rent of " + (data.rent || '[RENT]') + " in advance by the 5th of every month.\n3. The Lessee shall not sublet the premises.\n\nIN WITNESS WHEREOF, the parties have signed this agreement.\n\nLESSOR\nLESSEE"
            },
            {
                id: 'employment',
                title: 'Employment Contract',
                icon: Users,
                fields: [
                    { id: 'company', label: 'Company Name', placeholder: 'e.g. TechCorp Solutions' },
                    { id: 'employee', label: 'Employee Name', placeholder: 'e.g. Anil Kumar' },
                    { id: 'role', label: 'Job Title', placeholder: 'e.g. Senior Software Engineer' },
                    { id: 'salary', label: 'Annual Compensation', placeholder: 'e.g. Rs. 15,00,000 CTC' },
                    { id: 'probation', label: 'Probation Period', placeholder: 'e.g. 3 Months' }
                ],
                suggestionRefs: ['contract_notice', 'contract_ip'],
                generateDraft: (data) => "EMPLOYMENT AGREEMENT\n\nThis Agreement is between " + (data.company || '[COMPANY]') + " ('Employer') and " + (data.employee || '[EMPLOYEE]') + " ('Employee').\n\n1. POSITION: The Employer agrees to employ the Employee as " + (data.role || '[ROLE]') + ".\n2. COMPENSATION: The Employee shall be paid an annual compensation of " + (data.salary || '[SALARY]') + ".\n3. PROBATION: The first " + (data.probation || '[PROBATION]') + " shall constitute a probationary period.\n\nExecuted on the date written above.\n\nEMPLOYER\nEMPLOYEE"
            },
            {
                id: 'nda',
                title: 'NDA',
                icon: Lock,
                fields: [
                    { id: 'party1', label: 'Disclosing Party', placeholder: 'e.g. Innovator Inc.' },
                    { id: 'party2', label: 'Receiving Party', placeholder: 'e.g. Vendor Corp.' },
                    { id: 'purpose', label: 'Purpose of NDA', placeholder: 'e.g. Exploring M&A merger' },
                    { id: 'duration', label: 'Obligation Duration', placeholder: 'e.g. 3 Years' }
                ],
                suggestionRefs: ['contract_remedies', 'contract_exclusions'],
                generateDraft: (data) => "NON-DISCLOSURE AGREEMENT\n\nBetween " + (data.party1 || '[PARTY 1]') + " and " + (data.party2 || '[PARTY 2]') + ".\n\n1. PURPOSE: The parties intend to share information for the purpose of: " + (data.purpose || '[PURPOSE]') + ".\n2. CONFIDENTIALITY: The Receiving Party shall hold the Disclosing Party's Confidential Information in strict confidence for a period of " + (data.duration || '[DURATION]') + ".\n\nExecuted by authorized signatories.\n\nPARTY 1\nPARTY 2"
            }
        ]
    },
    {
        groupTitle: 'COURT FORMS',
        templates: [
            {
                id: 'vakalatnama',
                title: 'Vakalatnama',
                icon: FileSignature,
                fields: [
                    { id: 'court', label: 'Court Name', placeholder: 'e.g. Supreme Court of India' },
                    { id: 'client', label: 'Client Name', placeholder: 'e.g. XYZ Ltd.' },
                    { id: 'advocate', label: 'Advocate Name', placeholder: 'e.g. Senior Counsel Sharma' },
                    { id: 'caseNo', label: 'Case / Appeal No.', placeholder: 'e.g. SLP (C) 1245/2026' }
                ],
                suggestionRefs: [],
                generateDraft: (data) => "IN THE " + (data.court?.toUpperCase() || '[COURT]') + "\n" + (data.caseNo || '[CASE NO]') + "\n\nVAKALATNAMA\n\nI/We, " + (data.client || '[CLIENT]') + ", do hereby appoint " + (data.advocate || '[ADVOCATE]') + " to act, appear, and plead in the above-noted matter.\n\nI/We authorize the Advocate to sign, file, present pleadings, appeals, and swear affidavits on my/our behalf.\n\nEXECUTANT (CLIENT)\nACCEPTED (ADVOCATE)"
            },
            {
                id: 'affidavit',
                title: 'Affidavit',
                icon: FileText,
                fields: [
                    { id: 'deponent', label: 'Deponent Name', placeholder: 'e.g. Ramesh Singh' },
                    { id: 'age', label: 'Age / Father Name', placeholder: 'e.g. 45 yrs, S/o Suresh' },
                    { id: 'address', label: 'Address', placeholder: 'e.g. 12, Civil Lines...' },
                    { id: 'matter', label: 'Related Matter', placeholder: 'e.g. Support of Bail Application CA 12/2026' }
                ],
                suggestionRefs: ['affidavit_verification'],
                generateDraft: (data) => "AFFIDAVIT\n\nI, " + (data.deponent || '[DEPONENT]') + ", " + (data.age || '[AGE]') + ", residing at " + (data.address || '[ADDRESS]') + ", do hereby solemnly affirm and state as under:\n\n1. That I am the deponent in the " + (data.matter || '[MATTER]') + " and am fully conversant with the facts of the case.\n2. That the contents of the accompanying application are true and correct to my knowledge.\n\nDEPONENT\n\nVERIFICATION:\nVerified at ________ on this day that the contents of the affidavit are true, and nothing material has been concealed.\n\nDEPONENT"
            }
        ]
    }
];

// 2. AI SUGGESTION DICTIONARY
const SUGGESTION_LIBRARY = {
    bail_arnesh: { title: 'Cite Binding Precedent', text: 'Standard bail applications should reference Arnesh Kumar v. State of Bihar regarding strict 41A CrPC adherence.', action: "[INSERT: Reliance is aggressively placed on Arnesh Kumar v. State of Bihar (2014) 8 SCC 273 regarding strict adherence to Section 41A CrPC prior to making any routine arrest.]" },
    bail_flight: { title: 'Strengthen Flight Risk', text: 'Judges often deny bail if flight risk isn\'t explicitly mitigated. Insert a direct surety undertaking clause.', action: "[INSERT: That the applicant is ready and willing to furnish sound and solvent surety as directed by this Hon'ble Court and undertakes to cooperate fully.]" },
    anticipatory_cooperate: { title: 'Promise Cooperation', text: 'Anticipatory bail requires an explicit promise to join the investigation. Add the cooperation clause.', action: "[INSERT: The applicant undertakes to join the police investigation as and when required by the Investigating Officer.]" },
    anticipatory_blanket: { title: 'Fix Blanket Order Issue', text: 'Courts do not grant blanket anticipatory bail. Specify the exact FIR or apprehension source.', action: "[REWRITE: Ensure apprehension section explicitly lists the threatening FIR or Complaint number rather than a general fear of arrest.]" },
    fir_cctv: { title: 'Demand Evidence Preservation', text: 'Add a clause requesting the SHO to immediately seize CCTV footage before it is overwritten.', action: "[INSERT: I therefore urgently request you to seize and preserve the CCTV footage covering the incident location before it is automatically overwritten.]" },
    fir_delay: { title: 'Explain Delay in Filing', text: 'If the incident date is older than 24 hours, FIRs can be quashed for unexplained delay. Add a delay mitigation clause.', action: "[INSERT: The delay in filing this complaint occurred because the victim was undergoing medical trauma and was physically incapable of approaching the PS earlier.]" },
    civil_jurisdiction: { title: 'Assert Territorial Jurisdiction', text: 'Civil suits are dismissed if Section 20 CPC isn\'t explicitly satisfied in the pleadings.', action: "[INSERT: That this Hon'ble Court has the territorial jurisdiction to entertain the suit as the Defendants reside and the cause of action partially arose within its limits.]" },
    civil_limitation: { title: 'Assert Limitation Period', text: 'Confirm the suit is filed within the 3-year limitation act window.', action: "[INSERT: That the present suit is being filed well within the statutory period of limitation as prescribed by the Limitation Act, 1963.]" },
    injunction_prima: { title: 'Assert Triple Test', text: 'Order 39 injunctions require explicitly noting: Prima Facie Case, Balance of Convenience, and Irreparable Loss.', action: "[INSERT: That the Plaintiff has an excellent prima facie case, the balance of convenience lies entirely in their favor, and failure to grant an injunction will cause irreparable loss and injury.]" },
    injunction_balance: { title: 'Ex-Parte Justification', text: 'If asking for an ex-parte order without notice, you must justify the immediate urgency under Order 39 Rule 3.', action: "[INSERT: That the object of granting the injunction would be defeated by the delay of issuing notice to the Defendant, hence an ex-parte ad-interim injunction is urgently prayed for.]" },
    contract_lockin: { title: 'Add Lock-In Period', text: 'Protect the landlord by adding a mandatory 6-month lock-in period for rent agreements.', action: "[INSERT: The Lessee agrees to a mandatory lock-in period of 6 months. If vacated prior, the Lessee is liable to pay rent for the remaining lock-in period.]" },
    contract_maintenance: { title: 'Specify Maintenance', text: 'Clarify who pays societal maintenance charges.', action: "[INSERT: The monthly rent is exclusive of Society Maintenance charges, electricity, and water bills, which shall be borne by the Lessee separately.]" },
    contract_notice: { title: 'Define Termination Notice', text: 'Employment contracts must clearly define termination notice requirements for both sides.', action: "[INSERT: Either party may terminate this Agreement by providing 30 days' written notice or salary in lieu thereof.]" },
    contract_ip: { title: 'Add IP Assignment', text: 'Protect the company by assigning all employee-created IP directly to the Employer.', action: "[INSERT: The Employee agrees that any intellectual property, code, or materials created during the course of employment shall be the absolute property of the Employer.]" },
    contract_remedies: { title: 'Specify Injunctive Relief', text: 'NDAs are useless without the threat of an injunction. Add a specific relief clause.', action: "[INSERT: The Receiving Party acknowledges that a breach of this NDA will cause irreparable harm, and the Disclosing Party shall be entitled to seek immediate injunctive relief.]" },
    contract_exclusions: { title: 'Standardize Exclusions', text: 'Information already in the public domain cannot be protected by an NDA.', action: "[INSERT: Confidential Information shall not include data that is already in the public domain or independently developed by the Receiving Party without reference to the Disclosing Party's data.]" },
    affidavit_verification: { title: 'Strengthen Verification', text: 'A defective verification nullifies the affidavit. Ensure knowledge distinction.', action: "[INSERT: Verified that the contents of paras 1 to X are true to my personal knowledge, and paras Y to Z are true to my legal advice believed to be correct.]" }
};

const DraftAssistant = () => {
    const allTemplates = TEMPLATE_GROUPS.flatMap(g => g.templates);
    const [activeTemplateId, setActiveTemplateId] = useState('custom_upload');
    const currentTemplateDef = allTemplates.find(t => t.id === activeTemplateId);

    const [formData, setFormData] = useState({});

    // Custom Upload States
    const [uploadedDraftFile, setUploadedDraftFile] = useState(null);
    const [customAnalysisJSON, setCustomAnalysisJSON] = useState(null);
    const fileInputRef = useRef(null);

    // Generation States
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStage, setGenerationStage] = useState(0);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Document States
    const [documentContent, setDocumentContent] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0, visible: false });
    const editorRef = useRef(null);

    // AI Panel States
    const [aiProcessing, setAiProcessing] = useState(false);
    const [appliedSuggestion, setAppliedSuggestion] = useState(null);

    const switchTemplate = (id) => {
        setActiveTemplateId(id);
        setHasGenerated(false);
        setFormData({});
        setDocumentContent('');
        setUploadedDraftFile(null);
        setCustomAnalysisJSON(null);
        setToolbarPosition({ visible: false, top: 0, left: 0 });
        setSelectedText('');
    };

    const handleInputChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const triggerGeneration = () => {
        setIsGenerating(true);
        setGenerationStage(0);

        setTimeout(() => setGenerationStage(1), 800);
        setTimeout(() => setGenerationStage(2), 1600);

        setTimeout(() => {
            const generatedText = currentTemplateDef.generateDraft(formData);
            setDocumentContent(generatedText);
            setHasGenerated(true);
            setIsGenerating(false);
        }, 2400);
    };

    const handleFileUploadChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedDraftFile({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                rawContent: "[Simulated Raw PDF Text Content Extraction...]"
            });
        }
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const triggerCustomDraftAnalysis = () => {
        if (!uploadedDraftFile) return;

        setIsGenerating(true);
        setGenerationStage(0);

        setTimeout(() => setGenerationStage(1), 1000);
        setTimeout(() => setGenerationStage(2), 2000);
        setTimeout(() => setGenerationStage(3), 3200);

        setTimeout(() => {
            const mockApiResponse = {
                summary: "This document appears to be a Master Service Agreement (MSA) primarily governing intellectual property assignment and non-compete clauses for a vendor.",
                clauses: [
                    "Jurisdiction is locked to Santa Clara County.",
                    "Termination requires a 60-day written notice.",
                    "Indemnification is capped at total fees paid in the last 12 months."
                ],
                issues: [
                    "Missing Arbitration Clause. Standard dispute resolution mechanisms are entirely absent.",
                    "Non-compete clause is excessively broad (5 years globally) making it legally unenforceable in most jurisdictions.",
                    "Force Majeure does not explicitly cover pandemics or cybersecurity breaches."
                ],
                suggestions: [
                    { title: "Insert Arbitration Clause", text: "Mandate mediation in Santa Clara before lawsuit initiation.", action: "Adding binding arbitration clause." },
                    { title: "Limit Non-Compete Scope", text: "Restrict the non-compete geographically to California and shorten duration to 12 months.", action: "Rewriting non-compete constraints." },
                    { title: "Expand Force Majeure", text: "Include ransomware attacks and global pandemics to limit liability.", action: "Expanding Force Majeure definitions." }
                ]
            };

            setCustomAnalysisJSON(mockApiResponse);
            setDocumentContent("[RENDERED DOCUMENT TEXT FROM " + uploadedDraftFile.name + "]\n\nWhereas the parties agree to enter into an MSA...\n(This is a simulated rendering of the uploaded PDF to allow inline editing.)");
            setHasGenerated(true);
            setIsGenerating(false);
        }, 4500);
    };

    const getLoadingText = () => {
        if (activeTemplateId === 'custom_upload') {
            if (generationStage === 0) return "Parsing physical document payload...";
            if (generationStage === 1) return "Extracting and mapping legal clauses...";
            if (generationStage === 2) return "Cross-referencing liability risks against statutory indices...";
            return "Packaging dynamic JSON insights and structural improvements...";
        } else {
            if (generationStage === 0) return "Generating initial draft architecture...";
            if (generationStage === 1) return "Structuring format and legal boilerplate...";
            return "Adding necessary legal citations and final NLP review...";
        }
    };

    const handleTextSelection = () => {
        if (!hasGenerated) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length > 8) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setToolbarPosition({
                top: Math.max(0, rect.top - 60 + window.scrollY),
                left: rect.left + (rect.width / 2),
                visible: true
            });
            setSelectedText(text);
        } else {
            setToolbarPosition({ ...toolbarPosition, visible: false });
            setSelectedText('');
        }
    };

    const handleInlineAiAction = (actionType) => {
        if (!selectedText) return;
        setToolbarPosition({ ...toolbarPosition, visible: false });
        setAiProcessing(true);
        setTimeout(() => {
            const updatedDoc = documentContent.replace(selectedText, "[AI Re-structured: " + selectedText + "]");
            setDocumentContent(updatedDoc);
            setAiProcessing(false);
            if (editorRef.current) editorRef.current.innerText = updatedDoc;
        }, 900);
    };

    const handlePanelSuggestion = (id, textToInsert) => {
        setAppliedSuggestion(id);
        const updatedDoc = documentContent + '\n\n' + textToInsert;
        setDocumentContent(updatedDoc);
        if (editorRef.current) editorRef.current.innerText = updatedDoc;
        setTimeout(() => setAppliedSuggestion(null), 2000);
    };

    return (
        <div className="workspace-layout">

            {/* LEFT: TEMPLATES & STRUCTURE */}
            <aside className="draft-sidebar">
                <div className="sidebar-header-workspace">
                    <h3>Draft Library</h3>
                </div>

                <div className="template-list">
                    {TEMPLATE_GROUPS.map((group, gIdx) => (
                        <div key={gIdx} className="sidebar-category-group">
                            <h5 className="sidebar-category-title">{group.groupTitle}</h5>
                            {group.templates.map(t => (
                                <div
                                    key={t.id}
                                    className={"template-item " + (activeTemplateId === t.id ? 'active' : '')}
                                    onClick={() => switchTemplate(t.id)}
                                >
                                    <t.icon size={18} className="template-icon" />
                                    <div>
                                        <h4>{t.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            {/* CENTER: FORM / UPLOAD -> A4 EDITOR HYBRID */}
            <main className="editor-area">

                {!hasGenerated && !isGenerating && (
                    <div className="form-draft-container animate-fade-in">

                        {activeTemplateId === 'custom_upload' ? (
                            <div className="custom-upload-wrapper">
                                <div className="draft-form-header">
                                    <h2>Analyze Your Own Draft</h2>
                                    <p>Upload your legal document and get high-speed AI-powered insights, flaw detection, and structural improvements mapped directly to statutory precedents.</p>
                                </div>
                                <div className="draft-form-body">
                                    <div
                                        className="custom-upload-zone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf,.docx,.doc"
                                            className="hidden-file-input"
                                            ref={fileInputRef}
                                            onChange={handleFileUploadChange}
                                        />
                                        <UploadCloud size={48} className="upload-cloud-icon mx-auto text-primary opacity-70 mb-4" />
                                        <h3>Drag & Drop your Document Here</h3>
                                        <p>Supported Formats: PDF, DOCX (Max 1 file)</p>
                                    </div>

                                    {uploadedDraftFile && (
                                        <div className="uploaded-draft-row animate-fade-in">
                                            <FileText size={20} className="text-primary" />
                                            <div className="draft-file-meta">
                                                <span className="file-name">{uploadedDraftFile.name}</span>
                                                <span className="file-size">{uploadedDraftFile.size}</span>
                                            </div>
                                            <button className="remove-draft-btn" onClick={() => setUploadedDraftFile(null)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        className={"smart-generate-btn mt-6 " + (!uploadedDraftFile ? 'opacity-50 cursor-not-allowed' : '')}
                                        disabled={!uploadedDraftFile}
                                        onClick={triggerCustomDraftAnalysis}
                                    >
                                        <Sparkles size={20} />
                                        Analyze Draft
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="standard-form-wrapper">
                                <div className="draft-form-header">
                                    <h2>Draft Details: {currentTemplateDef.title}</h2>
                                    <p>Provide the foundational metadata. NyayaSetu AI will physically construct the strict legal structure, formatting, and standard clauses in seconds.</p>
                                </div>

                                <div className="draft-form-body">
                                    <div className="form-grid-premium">
                                        {currentTemplateDef.fields.map(field => (
                                            <div key={field.id} className={"form-group-premium " + (field.type === 'textarea' ? 'full-width' : '')}>
                                                <label>{field.label}</label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        rows="3"
                                                        placeholder={field.placeholder}
                                                        value={formData[field.id] || ''}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    ></textarea>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder={field.placeholder}
                                                        value={formData[field.id] || ''}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="smart-generate-btn" onClick={triggerGeneration}>
                                        <Sparkles size={20} />
                                        Generate Physical Draft
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STATE 2: Loading Sequence */}
                {isGenerating && (
                    <div className="generation-loading-state animate-fade-in">
                        <div className="spinner-ring">
                            <Loader2 size={48} className="spin text-primary" />
                        </div>
                        <h3>{activeTemplateId === 'custom_upload' ? 'AI Review Protocol Active...' : 'Initializing Document...'}</h3>
                        <p className="loading-stage-text">{getLoadingText()}</p>
                    </div>
                )}

                {/* STATE 3: The Canvas */}
                {hasGenerated && (
                    <div className="canvas-wrapper">
                        <div className="editor-controls animate-fade-in">
                            <div className="formatting-group">
                                <button className="format-btn"><Bold size={16} /></button>
                                <button className="format-btn"><Italic size={16} /></button>
                            </div>
                            <div className="formatting-group">
                                <button className="format-btn active"><AlignLeft size={16} /></button>
                                <button className="format-btn"><AlignCenter size={16} /></button>
                                <button className="format-btn"><AlignJustify size={16} /></button>
                            </div>

                            <div className="editor-actions ml-auto">
                                <button className="editor-action-btn secondary" onClick={() => setHasGenerated(false)}>
                                    <Edit3 size={15} /> {activeTemplateId === 'custom_upload' ? 'Upload Different File' : 'Edit Details'}
                                </button>
                                {activeTemplateId !== 'custom_upload' && (
                                    <button className="editor-action-btn secondary" onClick={() => triggerGeneration()}>
                                        <RefreshCw size={15} /> Regenerate
                                    </button>
                                )}
                                <button className="editor-action-btn secondary">
                                    <Copy size={15} /> Copy Text
                                </button>
                                <button className="editor-action-btn primary">
                                    <Download size={15} /> Download PDF
                                </button>
                            </div>
                        </div>

                        <div className="a4-canvas animate-fade-in" onMouseUp={handleTextSelection}>
                            <div
                                className="a4-page"
                                ref={editorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => setDocumentContent(e.currentTarget.innerText)}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {documentContent}
                            </div>

                            {toolbarPosition.visible && (
                                <div
                                    className="inline-ai-toolbar animate-fade-in"
                                    style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
                                >
                                    <button onClick={() => handleInlineAiAction('Rewrite')}>
                                        <Sparkles size={14} /> Rewrite Legally
                                    </button>
                                    <button onClick={() => handleInlineAiAction('Expand')}>
                                        Expand Point
                                    </button>
                                    <button onClick={() => handleInlineAiAction('Cite')}>
                                        Cite Authority
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* RIGHT: CONTEXTUAL AI PANEL */}
            <aside className="ai-insight-panel">
                <div className="ai-panel-header">
                    <Sparkles size={18} className="text-primary" />
                    <h3>{activeTemplateId === 'custom_upload' ? 'AI Document Analysis' : 'Drafting Copilot'}</h3>
                </div>

                <div className="ai-suggestions-feed">
                    {!hasGenerated && (
                        <div className="empty-suggestions">
                            <Wand2 size={32} className="text-secondary mx-auto mb-4 opacity-50" />
                            <p>{activeTemplateId === 'custom_upload'
                                ? 'Upload a PDF or DOCX file to generate structured JSON insights and flaw detection metrics.'
                                : 'Select a template and generate the base document.'}
                            </p>
                        </div>
                    )}

                    {/* POST-GENERATION: JSON RENDERER */}
                    {hasGenerated && activeTemplateId === 'custom_upload' && customAnalysisJSON && (
                        <div className="json-analysis-container animate-fade-in">

                            <div className="analysis-block blue-tint">
                                <h5 className="flex items-center gap-2 mb-2 text-blue-900 font-bold"><FileText size={16} /> Document Summary</h5>
                                <p className="text-sm text-blue-800 leading-relaxed">{customAnalysisJSON.summary}</p>
                            </div>

                            <div className="analysis-block border-l-4 border-gray-400">
                                <h5 className="flex items-center gap-2 mb-3 text-gray-800 font-bold"><ListChecks size={16} /> Key Extracted Clauses</h5>
                                <ul className="text-sm text-gray-600 list-disc pl-4 space-y-2">
                                    {customAnalysisJSON.clauses.map((clause, idx) => (
                                        <li key={"clause-" + idx}>{clause}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="analysis-block red-tint">
                                <h5 className="flex items-center gap-2 mb-3 text-red-900 font-bold"><AlertTriangle size={16} /> Missing/Weak Risks identified</h5>
                                <ul className="text-sm text-red-800 list-disc pl-4 space-y-2">
                                    {customAnalysisJSON.issues.map((issue, idx) => (
                                        <li key={"issue-" + idx}>{issue}</li>
                                    ))}
                                </ul>
                            </div>

                            <h5 className="text-sm text-gray-500 font-bold tracking-wider uppercase mt-4">Actionable AI Fixes</h5>
                            {customAnalysisJSON.suggestions.map((sug, idx) => (
                                <div key={"sug-" + idx} className="suggestion-card mt-2">
                                    <h5><ArrowRightCircle size={14} className="text-primary" /> {sug.title}</h5>
                                    <p>{sug.text}</p>
                                    <button
                                        className={"apply-btn " + (appliedSuggestion === "json_" + idx ? 'applied' : '')}
                                        onClick={() => handlePanelSuggestion("json_" + idx, sug.action)}
                                    >
                                        {appliedSuggestion === "json_" + idx ? <><Check size={14} /> Fixed Successfully</> : 'Apply Fix to Document'}
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* POST-GENERATION: STANDARD TEMPLATE */}
                    {hasGenerated && activeTemplateId !== 'custom_upload' && currentTemplateDef.suggestionRefs.map((refId, i) => {
                        const sug = SUGGESTION_LIBRARY[refId];
                        if (!sug) return null;
                        return (
                            <div key={refId} className="suggestion-card animate-fade-in" style={{ animationDelay: (i * 0.15) + 's' }}>
                                <h5><CornerDownRight size={14} className="text-secondary" /> {sug.title}</h5>
                                <p>{sug.text}</p>
                                <button
                                    className={"apply-btn " + (appliedSuggestion === refId ? 'applied' : '')}
                                    onClick={() => handlePanelSuggestion(refId, sug.action)}
                                >
                                    {appliedSuggestion === refId ? <><Check size={14} /> Integrated Successfully</> : 'Apply Strategy'}
                                </button>
                            </div>
                        )
                    })}

                    {aiProcessing && (
                        <div className="processing-state animate-fade-in">
                            <Loader2 size={24} className="spin text-primary opacity-50 mb-3" />
                            <p>Re-calibrating legal logic...</p>
                        </div>
                    )}
                </div>
            </aside>

        </div>
    );
};

export default DraftAssistant;
