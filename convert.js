const fs = require('fs');
const path = require('path');

const workspaceDir = __dirname;
const inputPath = path.join(workspaceDir, "AL_Chemistry_Tamil_Master.md");
const outputPath = path.join(workspaceDir, "AL_Chemistry_Tamil_Master.html");
const indexPath = path.join(workspaceDir, "index.html");

console.log(`Reading from: ${inputPath}`);
console.log(`Writing to: ${outputPath}`);

const mdContent = fs.readFileSync(inputPath, 'utf8');

const AUTHOR = {
    name: 'J.Abiraj',
    degree: 'BSc (Hons) in Computer Science',
    initials: 'JA',
    platform: 'Sri Lankan A/L Chemistry Knowledge Platform'
};

// Helper to escape HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Inline parser
function parseInline(text) {
    text = escapeHtml(text);
    
    // Bold: **text**
    text = text.replace(/\*\|(.*?)\|\*/g, "<strong>$1</strong>"); // fallback if needed
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Italic: *text* (whitespace boundary to prevent breaking chemistry formulas like σ* or π*)
    text = text.replace(/(^|\s)\*([^*]+?)\*(?=$|\s|[.,!?;:])/g, "$1<em>$2</em>");
    
    // Inline code: `code`
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");
    
    // Links: [text](link)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Highlights & Emojis
    text = text.replace(/🔑/g, '<span class="emoji-badge">🔑</span>');
    text = text.replace(/📌/g, '<span class="emoji-badge">📌</span>');
    text = text.replace(/⚠️/g, '<span class="emoji-badge">⚠️</span>');
    text = text.replace(/🔴/g, '<span class="status-dot dot-red"></span>');
    text = text.replace(/🟢/g, '<span class="status-dot dot-green"></span>');
    text = text.replace(/⭐/g, '<span class="star-icon">★</span>');
    
    return text;
}

// Icon Definitions
const icons = {
    concept: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
    exam: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>',
    reminder: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    summary: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    calc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
    formula: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-binary"><rect x="14" y="14" width="4" height="6" rx="1"/><rect x="14" y="4" width="4" height="6" rx="1"/><path d="M10 2v20"/><path d="M6 10H2V4h4"/><path d="M2 10h4"/><path d="M6 20H2v-6h4"/><path d="M2 20h4"/></svg>',
    definition: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    pastpaper: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
    practical: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M10 2v7.51L4.39 17.61a1 1 0 0 0-.19.92A1 1 0 0 0 5.15 19h13.7a1 1 0 0 0 .95-.47 1 1 0 0 0-.19-.92L14 9.51V2"/><path d="M8 2h8"/><path d="M6.5 15h11"/></svg>',
    intro: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
    default: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>'
};

// Section type detector and styler
function getSectionClassAndIcon(title, contentPreview = "") {
    const titleLower = title.toLowerCase();
    
    if (title.includes("பாட அறிமுகம்") || title.includes("அறிமுகம்") || title.includes("பாடத்தின் நோக்கம்")) {
        return ["card-intro", icons.intro];
    } else if (title.includes("முக்கிய கருத்து")) {
        return ["card-key-concept", icons.concept];
    } else if (title.includes("பரீட்சை") || title.includes("பரீட்சையில் முக்கியமான") || title.includes("முக்கியமான பகுதிகள்") || (title.includes("விளக்கம்") && contentPreview.includes("பரீட்சை"))) {
        return ["card-exam-tip", icons.exam];
    } else if (title.includes("நினைவூட்டல்") || title.includes("நினைவில்")) {
        return ["card-reminder", icons.reminder];
    } else if (title.includes("பிழைகள்") || title.includes("பொதுவான பிழைகள்")) {
        return ["card-common-errors", icons.error];
    } else if (title.includes("சுருக்க குறிப்புகள்") || title.includes("இறுதி மீள்பார்வை") || title.includes("விரைவு மீள்பார்வை") || title.includes("தொகுப்பு") || titleLower.includes("revision")) {
        return ["card-summary-notes", icons.summary];
    } else if (title.includes("கணக்கீடு") || title.includes("கணக்கு") || title.includes("கணிப்பு")) {
        return ["card-calculation", icons.calc];
    } else if (title.includes("சமன்பாடுகள்") || title.includes("சூத்திரங்கள்") || titleLower.includes("formula")) {
        return ["card-formula", icons.formula];
    } else if (title.includes("வரையறைகள்") || title.includes("சொல்லடைவு") || titleLower.includes("definition")) {
        return ["card-definition", icons.definition];
    } else if (titleLower.includes("past paper") || title.includes("வினாக்கள்")) {
        return ["card-past-paper", icons.pastpaper];
    } else if (titleLower.includes("practical") || title.includes("ஆய்வக")) {
        return ["card-practical", icons.practical];
    } else {
        return ["card-default", icons.default];
    }
}

// Convert a block of lines to HTML
function convertBlockToHtml(blockLines, lessonId) {
    let htmlLines = [];
    let listStack = []; // Stack to support nested lists with indentation levels
    let inTable = false;
    let tableRows = [];
    let inCode = false;
    let codeContent = [];
    let codeLang = "";

    let i = 0;
    while (i < blockLines.length) {
        let line = blockLines[i].trim();
        
        // Math blocks display bypass (ensures LaTeX symbols like * or < are not parsed as HTML)
        if (line.startsWith("$$") && line.endsWith("$$")) {
            if (listStack.length > 0) {
                while (listStack.length > 0) {
                    let popped = listStack.pop();
                    htmlLines.push(`</${popped.type}>`);
                }
            }
            if (inTable) {
                htmlLines.push(renderTable(tableRows));
                inTable = false;
                tableRows = [];
            }
            htmlLines.push(`<div class="math-display-container">${line}</div>`);
            i++;
            continue;
        }

        // Code blocks
        if (line.startsWith("```")) {
            if (inCode) {
                htmlLines.push(`<pre class="code-block ${codeLang}"><code class="fira-code">${codeContent.join("")}</code></pre>`);
                codeContent = [];
                inCode = false;
            } else {
                inCode = true;
                codeLang = line.slice(3).trim();
            }
            i++;
            continue;
        }
            
        if (inCode) {
            codeContent.push(escapeHtml(blockLines[i]) + "\n");
            i++;
            continue;
        }

        // Table block
        if (line.startsWith("|")) {
            if (line.includes("---")) {
                i++;
                continue;
            }
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            tableRows.push(line);
            i++;
            continue;
        } else {
            if (inTable) {
                htmlLines.push(renderTable(tableRows));
                inTable = false;
                tableRows = [];
            }
        }

        // Empty lines
        if (!line) {
            if (listStack.length > 0) {
                while (listStack.length > 0) {
                    let popped = listStack.pop();
                    htmlLines.push(`</${popped.type}>`);
                }
            }
            i++;
            continue;
        }

        // Headers
        const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (hMatch) {
            if (listStack.length > 0) {
                while (listStack.length > 0) {
                    let popped = listStack.pop();
                    htmlLines.push(`</${popped.type}>`);
                }
            }
            let level = hMatch[1].length;
            let hText = parseInline(hMatch[2]);
            let hClean = hMatch[2]
                .trim()
                .toLowerCase()
                .replace(/["'()\[\]{}:.,?!;]/g, '')
                .replace(/\s+/g, '-');
            let hId = `${lessonId}-${hClean}`;
            htmlLines.push(`<h${level} id="${hId}" class="heading-level-${level}">${hText}</h${level}>`);
            i++;
            continue;
        }

        // List items (supports nested lists tracking space indentation)
        const origLine = blockLines[i];
        const listMatch = origLine.match(/^(\s*)([-\*]|\d+\.)\s+(.*)$/);
        
        if (listMatch) {
            let indent = listMatch[1].length;
            let marker = listMatch[2];
            let content = listMatch[3];
            let type = (marker === '-' || marker === '*') ? 'ul' : 'ol';
            let itemText = parseInline(content);
            
            if (listStack.length === 0) {
                listStack.push({ indent: indent, type: type });
                htmlLines.push(`<${type}>`);
            } else {
                let top = listStack[listStack.length - 1];
                if (indent > top.indent) {
                    listStack.push({ indent: indent, type: type });
                    htmlLines.push(`<${type}>`);
                } else if (indent < top.indent) {
                    while (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
                        let popped = listStack.pop();
                        htmlLines.push(`</${popped.type}>`);
                    }
                    if (listStack.length === 0) {
                        listStack.push({ indent: indent, type: type });
                        htmlLines.push(`<${type}>`);
                    } else {
                        let newTop = listStack[listStack.length - 1];
                        if (newTop.indent === indent && newTop.type !== type) {
                            let popped = listStack.pop();
                            htmlLines.push(`</${popped.type}>`);
                            listStack.push({ indent: indent, type: type });
                            htmlLines.push(`<${type}>`);
                        }
                    }
                } else { // indent === top.indent
                    if (top.type !== type) {
                        let popped = listStack.pop();
                        htmlLines.push(`</${popped.type}>`);
                        listStack.push({ indent: indent, type: type });
                        htmlLines.push(`<${type}>`);
                    }
                }
            }
            
            htmlLines.push(`<li>${itemText}</li>`);
            i++;
            continue;
        } else {
            if (listStack.length > 0) {
                while (listStack.length > 0) {
                    let popped = listStack.pop();
                    htmlLines.push(`</${popped.type}>`);
                }
            }
        }

        // Blockquotes
        const bqMatch = line.match(/^>\s+(.*)$/);
        if (bqMatch) {
            let bqText = parseInline(bqMatch[1]);
            if (bqText.includes("📌") || bqText.includes("💡") || bqText.includes("🔑")) {
                htmlLines.push(`<div class="callout callout-info"><div class="callout-content">${bqText}</div></div>`);
            } else if (bqText.includes("🔴") || bqText.includes("⚠️") || bqText.includes("❌")) {
                htmlLines.push(`<div class="callout callout-warning"><div class="callout-content">${bqText}</div></div>`);
            } else {
                htmlLines.push(`<blockquote>${bqText}</blockquote>`);
            }
            i++;
            continue;
        }

        // Horizontal Rule
        if (line === "---") {
            htmlLines.push('<hr class="divider-hr" />');
            i++;
            continue;
        }

        // Regular Paragraph
        let pText = parseInline(line);
        htmlLines.push(`<p>${pText}</p>`);
        i++;
    }

    if (inTable) {
        htmlLines.push(renderTable(tableRows));
    }
    if (listStack.length > 0) {
        while (listStack.length > 0) {
            let popped = listStack.pop();
            htmlLines.push(`</${popped.type}>`);
        }
    }
    if (inCode) {
        htmlLines.push(`<pre class="code-block ${codeLang}"><code class="fira-code">${codeContent.join("")}</code></pre>`);
    }

    return htmlLines.join("\n");
}

// Render Table
function renderTable(rows) {
    if (!rows || rows.length === 0) return "";
    let html = ['<div class="table-container"><table class="premium-table">'];
    
    // Headers
    let headerCols = rows[0].split("|").slice(1, -1).map(c => c.trim());
    html.push('<thead><tr>');
    headerCols.forEach(col => {
        html.push(`<th>${parseInline(col)}</th>`);
    });
    html.push('</tr></thead>');
    
    // Body
    html.push('<tbody>');
    rows.slice(1).forEach(row => {
        let cols = row.split("|").slice(1, -1).map(c => c.trim());
        if (cols.length === 0) return;
        html.push('<tr>');
        cols.forEach(col => {
            html.push(`<td>${parseInline(col)}</td>`);
        });
        html.push('</tr>');
    });
    html.push('</tbody>');
    
    html.push('</table></div>');
    return html.join("\n");
}

// Parse into lessons
const lessonSplits = mdContent.split(/(?=# பாடம் |# 📊)/);
const headerPart = lessonSplits[0];
const lessonsParts = lessonSplits.slice(1);

console.log(`Detected ${lessonsParts.length} major sections to parse.`);

let tocData = [];
let convertedSections = [];

lessonsParts.forEach((part, idx) => {
    let lines = part.trim().split("\n");
    if (lines.length === 0 || !lines[0]) return;
    
    let titleLine = lines[0];
    let lessonTitle = "";
    let lessonSubtitle = "";
    let lessonId = "";
    let isLesson = true;
    let difficulty = "⭐⭐⭐⭐";
    let importance = "⭐⭐⭐⭐⭐";
    let studyTime = "15-20 மணித்தியாலங்கள்";
    
    if (titleLine.startsWith("# 📊")) {
        lessonTitle = "📊 இறுதி பகுப்பாய்வு மற்றும் விரிவான தொகுப்பு";
        lessonSubtitle = "Final Analysis & Complete Revision Sheet";
        lessonId = "final-revision";
        isLesson = false;
        difficulty = "⭐⭐⭐⭐";
        importance = "⭐⭐⭐⭐⭐";
        studyTime = "20-25 மணித்தியாலங்கள்";
    } else {
        const titleMatch = titleLine.match(/^#\s+பாடம்\s+(\d+):\s+(.*)$/);
        if (titleMatch) {
            let lessonNum = titleMatch[1];
            let lessonName = titleMatch[2];
            lessonTitle = `பாடம் ${lessonNum}: ${lessonName}`;
            lessonId = `lesson-${lessonNum}`;
        } else {
            lessonTitle = titleLine.replace("#", "").trim();
            lessonId = `lesson-custom-${idx}`;
        }
        
        // Scan metadata
        const scanLimit = Math.min(15, lines.length);
        for (let m = 1; m < scanLimit; m++) {
            let l = lines[m].trim();
            if (l.startsWith("## (")) {
                lessonSubtitle = l.replace("##", "").replace(/[()]/g, "").trim();
            } else if (l.includes("சிரமநிலை")) {
                let mDifficulty = l.match(/சிரமநிலை:\s*(⭐+)/);
                if (mDifficulty) difficulty = mDifficulty[1];
            } else if (l.includes("முக்கியத்துவம்")) {
                let mImportance = l.match(/முக்கியத்துவம்:\s*(⭐+)/);
                if (mImportance) importance = mImportance[1];
            } else if (l.includes("படிப்பு நேரம்")) {
                let mTime = l.match(/நேரம்:\s*(.*)$/);
                if (mTime) studyTime = mTime[1].trim();
            }
        }
    }
    
    tocData.push({
        id: lessonId,
        title: lessonTitle,
        subtitle: lessonSubtitle,
        isLesson: isLesson
    });
    
    // Filter lines
    let contentLines = [];
    lines.slice(1).forEach(l => {
        let lStrip = l.trim();
        if (lStrip.startsWith("## (")) return;
        if (lStrip.includes("சிரமநிலை:") || lStrip.includes("முக்கியத்துவம்:") || lStrip.includes("படிப்பு நேரம்:")) return;
        if (lStrip === "---" && contentLines.length < 5) return;
        contentLines.push(l);
    });
    
    // Subsections
    let subsections = [];
    let currSubTitle = "அறிமுகம்";
    let currSubLines = [];
    
    contentLines.forEach(cl => {
        let clStrip = cl.trim();
        if (clStrip.startsWith("## ") && !clStrip.startsWith("## (")) {
            if (currSubLines.length > 0) {
                subsections.push({ title: currSubTitle, lines: currSubLines });
            }
            currSubTitle = clStrip.replace("##", "").trim();
            currSubLines = [];
        } else {
            currSubLines.push(cl);
        }
    });
    if (currSubLines.length > 0) {
        subsections.push({ title: currSubTitle, lines: currSubLines });
    }
    
    let subsectionsHtml = [];
    subsections.forEach(sub => {
        let contentPreview = sub.lines.slice(0, 10).join(" ");
        let [cardClass, cardIcon] = getSectionClassAndIcon(sub.title, contentPreview);
        let subClean = sub.title
            .trim()
            .toLowerCase()
            .replace(/["'()\[\]{}:.,?!;]/g, '')
            .replace(/\s+/g, '-');
        let subId = `${lessonId}-${subClean}`;
        let subHtmlContent = convertBlockToHtml(sub.lines, lessonId);
        
        subsectionsHtml.push(`
        <div class="premium-card ${cardClass}" id="${subId}">
            <div class="card-header">
                <div class="card-icon">${cardIcon}</div>
                <h3 class="card-title-text">${sub.title}</h3>
            </div>
            <div class="card-body">
                ${subHtmlContent}
            </div>
        </div>
        `);
    });
    
    let collapsedClass = idx === 0 ? "" : "collapsed";
    let badgeColor = importance.length >= 5 ? "badge-danger" : "badge-warning";
    
    let lessonHtml = `
    <section class="lesson-section ${collapsedClass}" id="${lessonId}">
        <div class="lesson-header" onclick="toggleLesson('${lessonId}')">
            <div class="lesson-title-group">
                <span class="collapse-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <div class="title-meta">
                    <h2 class="lesson-main-title">${lessonTitle}</h2>
                    ${lessonSubtitle ? `<span class="lesson-subtitle">${lessonSubtitle}</span>` : ''}
                </div>
            </div>
            <div class="lesson-meta-badges">
                <span class="meta-badge badge-difficulty">சிரமநிலை: ${difficulty}</span>
                <span class="meta-badge ${badgeColor}">முக்கியத்துவம்: {importance}</span>
                <span class="meta-badge badge-time">நேரம்: ${studyTime}</span>
            </div>
        </div>
        <div class="lesson-content">
            ${subsectionsHtml.join("\n")}
        </div>
    </section>
    `;
    
    // Quick template substitution in lessonHtml since we use the variable
    lessonHtml = lessonHtml.replace('{importance}', importance);
    
    convertedSections.push(lessonHtml);
});

let welcomeSectionHtml = '';
const headerContentLines = headerPart.trim().split('\n').slice(2).filter(l => l.trim() && l.trim() !== '---');
if (headerContentLines.length > 0) {
    const welcomeBody = convertBlockToHtml(headerContentLines, 'welcome');
    welcomeSectionHtml = `
<div class="premium-card card-intro welcome-section-card" id="welcome-section">
    <div class="card-header">
        <div class="card-icon">${icons.summary}</div>
        <h3 class="card-title-text">வளநூல் அறிமுகம் &amp; அலகு விபரம்</h3>
    </div>
    <div class="card-body">
        ${welcomeBody}
    </div>
</div>`;
    tocData.unshift({
        id: 'welcome-section',
        title: '📚 அறிமுகம் & அலகு விபரம்',
        subtitle: 'Introduction & Unit Index',
        isLesson: false
    });
}

let sidebarNavHtml = [];
tocData.forEach(item => {
    let badgeStyle = item.isLesson ? '<span class="nav-dot-badge"></span>' : '<span class="nav-dot-badge dot-summary"></span>';
    sidebarNavHtml.push(`
    <a href="#${item.id}" class="sidebar-nav-item" onclick="showAndScrollTo('${item.id}', event)">
        ${badgeStyle}
        <div class="nav-text-group">
            <span class="nav-main-title">${item.title}</span>
            ${item.subtitle ? `<span class="nav-subtitle">${item.subtitle}</span>` : ''}
        </div>
    </a>
    `);
});

// Template insertion
const finalHtml = `<!DOCTYPE html>
<html lang="ta" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>க.பொ.த (உயர் தரம்) இரசாயனவியல் - தமிழ் வளநூல்</title>
    
    <!-- SEO Optimization -->
    <meta name="description" content="தேசிய கல்வி நிறுவகம் (NIE), இலங்கையின் தரம் 12 & 13 க.பொ.த (உயர் தரம்) இரசாயனவியல் தமிழ் மொழிமூல வளநூல்களின் முழுமையான டிஜிட்டல் அறிவுத் தளம்.">
    <meta name="author" content="${AUTHOR.name} — ${AUTHOR.degree}">
    <meta name="keywords" content="A/L Chemistry Tamil, உயர் தரம் இரசாயனவியல், NIE Chemistry Tamil, Sri Lankan Chemistry Tamil Notes, J.Abiraj Chemistry">
    
    <!-- Premium Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Catamaran:wght@300;400;500;600;700&family=Hind+Madurai:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- MathJax for rendering LaTeX and Chemistry formulas -->
    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
            }
        };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <!-- Custom Premium Stylesheets -->
    <style>
        :root {
            /* Light Theme Palette */
            --bg-primary-light: #f6f8fc;
            --bg-secondary-light: #ffffff;
            --bg-sidebar-light: #ffffff;
            --text-primary-light: #0f172a;
            --text-secondary-light: #475569;
            --text-muted-light: #64748b;
            --accent-light: #0d9488; /* Beautiful Teal */
            --accent-hover-light: #0f766e;
            --accent-light-bg: #ccfbf1;
            --border-light: #e2e8f0;
            --shadow-light: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -1px rgba(15, 23, 42, 0.03);
            --shadow-hover-light: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
            --glass-bg-light: rgba(255, 255, 255, 0.8);
            --glass-border-light: rgba(226, 232, 240, 0.8);
            
            /* Dark Theme Palette */
            --bg-primary-dark: #090d16;
            --bg-secondary-dark: #121824;
            --bg-sidebar-dark: #0e131f;
            --text-primary-dark: #f8fafc;
            --text-secondary-dark: #cbd5e1;
            --text-muted-dark: #94a3b8;
            --accent-dark: #2dd4bf; /* Vibrant Turquoise */
            --accent-hover-dark: #14b8a6;
            --accent-dark-bg: #115e59;
            --border-dark: #1e293b;
            --shadow-dark: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            --shadow-hover-dark: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
            --glass-bg-dark: rgba(18, 24, 36, 0.8);
            --glass-border-dark: rgba(30, 41, 59, 0.8);
            
            /* Shared Card Colors */
            --intro-border: #0ea5e9;
            --intro-bg-light: rgba(14, 165, 233, 0.05);
            --intro-bg-dark: rgba(14, 165, 233, 0.08);

            --concept-border: #0d9488;
            --concept-bg-light: rgba(13, 148, 136, 0.05);
            --concept-bg-dark: rgba(13, 148, 136, 0.08);

            --exam-border: #ef4444;
            --exam-bg-light: rgba(239, 68, 68, 0.05);
            --exam-bg-dark: rgba(239, 68, 68, 0.08);

            --reminder-border: #8b5cf6;
            --reminder-bg-light: rgba(139, 92, 246, 0.05);
            --reminder-bg-dark: rgba(139, 92, 246, 0.08);

            --error-border: #f97316;
            --error-bg-light: rgba(249, 115, 22, 0.05);
            --error-bg-dark: rgba(249, 115, 22, 0.08);

            --summary-border: #10b981;
            --summary-bg-light: rgba(16, 185, 129, 0.05);
            --summary-bg-dark: rgba(16, 185, 129, 0.08);

            --calc-border: #64748b;
            --calc-bg-light: rgba(100, 116, 139, 0.05);
            --calc-bg-dark: rgba(100, 116, 139, 0.08);

            --formula-border: #06b6d4;
            --formula-bg-light: rgba(6, 182, 212, 0.05);
            --formula-bg-dark: rgba(6, 182, 212, 0.08);

            --definition-border: #eab308;
            --definition-bg-light: rgba(234, 179, 8, 0.05);
            --definition-bg-dark: rgba(234, 179, 8, 0.08);

            --pastpaper-border: #6366f1;
            --pastpaper-bg-light: rgba(99, 102, 241, 0.05);
            --pastpaper-bg-dark: rgba(99, 102, 241, 0.08);

            --practical-border: #ec4899;
            --practical-bg-light: rgba(236, 72, 153, 0.05);
            --practical-bg-dark: rgba(236, 72, 153, 0.08);

            /* Default Variables mapping (JS toggles this) */
            --bg-primary: var(--bg-primary-light);
            --bg-secondary: var(--bg-secondary-light);
            --bg-sidebar: var(--bg-sidebar-light);
            --text-primary: var(--text-primary-light);
            --text-secondary: var(--text-secondary-light);
            --text-muted: var(--text-muted-light);
            --accent: var(--accent-light);
            --accent-hover: var(--accent-hover-light);
            --accent-bg: var(--accent-light-bg);
            --border: var(--border-light);
            --shadow: var(--shadow-light);
            --shadow-hover: var(--shadow-hover-light);
            --glass-bg: var(--glass-bg-light);
            --glass-border: var(--glass-border-light);
            
            --sidebar-width: 300px;
            --font-body: 'Catamaran', 'Noto Sans Tamil', 'Inter', sans-serif;
            --font-heading: 'Hind Madurai', 'Noto Sans Tamil', sans-serif;
        }

        [data-theme="dark"] {
            --bg-primary: var(--bg-primary-dark);
            --bg-secondary: var(--bg-secondary-dark);
            --bg-sidebar: var(--bg-sidebar-dark);
            --text-primary: var(--text-primary-dark);
            --text-secondary: var(--text-secondary-dark);
            --text-muted: var(--text-muted-dark);
            --accent: var(--accent-dark);
            --accent-hover: var(--accent-hover-dark);
            --accent-bg: var(--accent-dark-bg);
            --border: var(--border-dark);
            --shadow: var(--shadow-dark);
            --shadow-hover: var(--shadow-hover-dark);
            --glass-bg: var(--glass-bg-dark);
            --glass-border: var(--glass-border-dark);
        }

        /* General Styling */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        html {
            scroll-behavior: smooth;
            font-size: 16px;
            color-scheme: light dark;
        }

        body {
            font-family: var(--font-body);
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.8;
            letter-spacing: 0.015em;
            display: flex;
            min-height: 100vh;
            min-height: 100dvh;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        :focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }

        /* Layout Structure */
        .sidebar {
            width: var(--sidebar-width);
            height: 100vh;
            height: 100dvh;
            max-height: 100dvh;
            position: fixed;
            left: 0;
            top: 0;
            background-color: var(--bg-sidebar);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            min-height: 0;
            z-index: 110;
            box-shadow: var(--shadow);
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, box-shadow 0.35s ease;
            padding-top: env(safe-area-inset-top, 0px);
        }

        body.sidebar-open {
            overflow: hidden;
        }

        .main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            padding: 28px 32px;
            max-width: 1300px;
            width: calc(100% - var(--sidebar-width));
            display: flex;
            flex-direction: column;
            gap: 28px;
        }

        /* Top Progress Bar */
        .progress-bar-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background-color: transparent;
            z-index: 200;
        }

        .progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--accent), #f43f5e);
            border-radius: 0 5px 5px 0;
        }

        @media (min-width: 1025px) {
            .progress-bar-container {
                left: var(--sidebar-width);
                width: calc(100% - var(--sidebar-width));
            }
        }

        /* Sidebar Logo / Branding */
        .sidebar-header {
            padding: 14px 18px;
            border-bottom: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
        }

        .sidebar-header-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
        }

        .sidebar-close-btn {
            display: none;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            min-width: 36px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: var(--bg-primary);
            color: var(--text-secondary);
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.2s ease;
        }

        .sidebar-close-btn:hover {
            color: var(--accent);
            border-color: var(--accent);
            background: var(--accent-bg);
        }

        /* Sidebar Author Card */
        .sidebar-author {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-bottom: 1px solid var(--border);
            background: linear-gradient(135deg, rgba(13, 148, 136, 0.06) 0%, transparent 100%);
            flex-shrink: 0;
        }

        [data-theme="dark"] .sidebar-author {
            background: linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, transparent 100%);
        }

        .sidebar-author-avatar {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--accent), #0f766e);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 0.78rem;
            letter-spacing: 0.03em;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
        }

        .sidebar-author-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .sidebar-author-label {
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
            font-weight: 600;
        }

        .sidebar-author-name {
            font-family: 'Inter', sans-serif;
            font-size: 0.88rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
        }

        .sidebar-author-degree {
            font-size: 0.75rem;
            color: var(--accent);
            font-weight: 500;
            line-height: 1.3;
        }

        .logo-title {
            font-family: var(--font-heading);
            font-size: 1.08rem;
            font-weight: 700;
            color: var(--accent);
            line-height: 1.35;
        }

        .logo-tag {
            font-size: 0.74rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        /* Search Box */
        .search-container {
            padding: 10px 18px;
            border-bottom: 1px solid var(--border);
            position: relative;
            flex-shrink: 0;
        }

        .search-input {
            width: 100%;
            padding: 9px 12px 9px 36px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font-body);
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s ease;
        }

        .search-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }

        .search-icon {
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
        }

        /* Navigation List */
        .sidebar-menu {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .sidebar-nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 10px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .sidebar-nav-item:hover {
            background-color: var(--bg-primary);
            color: var(--accent);
        }

        .sidebar-nav-item.active {
            background-color: var(--accent-bg);
            color: var(--accent-hover-light);
            font-weight: 600;
        }

        [data-theme="dark"] .sidebar-nav-item.active {
            background-color: var(--accent-bg);
            color: var(--text-primary);
        }

        .nav-dot-badge {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--accent);
            flex-shrink: 0;
        }

        .nav-dot-badge.dot-summary {
            background-color: #f43f5e;
        }

        .nav-text-group {
            display: flex;
            flex-direction: column;
        }

        .nav-main-title {
            font-family: var(--font-heading);
            font-size: 0.88rem;
            line-height: 1.3;
        }

        .nav-subtitle {
            font-size: 0.7rem;
            color: var(--text-muted);
        }

        /* Sidebar Footer / Controls */
        .sidebar-footer {
            padding: 12px 18px;
            padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--bg-sidebar);
            flex-shrink: 0;
        }

        .control-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 8px;
            min-width: 40px;
            min-height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .control-btn:hover {
            background-color: var(--bg-primary);
            color: var(--accent);
            transform: scale(1.1);
        }

        /* Hero / Header Section */
        .hero-section {
            --hero-border: rgba(255, 255, 255, 0.22);
            background: linear-gradient(145deg, #042f2e 0%, #0d5c56 38%, #0f766e 58%, #0c4a6e 100%);
            border-radius: 22px;
            padding: 2px;
            color: #ffffff;
            position: relative;
            overflow: hidden;
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.06) inset,
                0 24px 48px -28px rgba(2, 6, 23, 0.85),
                0 8px 24px -12px rgba(13, 148, 136, 0.35);
            display: flex;
            flex-direction: column;
            gap: 0;
            isolation: isolate;
        }

        .hero-section > .hero-shell {
            border-radius: 20px;
            padding: 26px 28px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: relative;
            overflow: hidden;
            background: linear-gradient(160deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 118, 110, 0.2) 100%);
        }

        .hero-bg {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
            border-radius: inherit;
        }

        .hero-bg-mesh {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 10% 20%, rgba(45, 212, 191, 0.35) 0%, transparent 55%),
                radial-gradient(ellipse 50% 40% at 92% 8%, rgba(56, 189, 248, 0.25) 0%, transparent 50%),
                radial-gradient(ellipse 40% 50% at 75% 95%, rgba(16, 185, 129, 0.2) 0%, transparent 45%);
        }

        .hero-bg-grid {
            position: absolute;
            inset: 0;
            opacity: 0.35;
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 32px 32px;
            mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 75%);
        }

        .hero-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.55;
        }

        .hero-orb-1 {
            width: 180px;
            height: 180px;
            top: -40px;
            right: 12%;
            background: #2dd4bf;
        }

        .hero-orb-2 {
            width: 140px;
            height: 140px;
            bottom: -30px;
            left: 55%;
            background: #38bdf8;
        }

        @media (prefers-reduced-motion: no-preference) {
            .hero-orb-1 {
                animation: hero-float 8s ease-in-out infinite;
            }
            .hero-orb-2 {
                animation: hero-float 10s ease-in-out infinite reverse;
            }
            .hero-highlight {
                background-size: 200% auto;
                animation: hero-shimmer 6s linear infinite;
            }
        }

        @keyframes hero-float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(12px, -16px); }
        }

        @keyframes hero-shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }

        .hero-inner {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            align-items: center;
        }

        @media (min-width: 880px) {
            .hero-inner {
                grid-template-columns: 1fr minmax(200px, 240px);
                gap: 24px;
            }
        }

        .hero-main {
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 0;
        }

        .hero-visual {
            display: none;
            position: relative;
        }

        @media (min-width: 880px) {
            .hero-visual {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .hero-molecule-card {
            width: 100%;
            max-width: 220px;
            aspect-ratio: 1;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                0 16px 40px -20px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 20px;
            position: relative;
        }

        .hero-molecule-card::before {
            content: '';
            position: absolute;
            inset: 12px;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .hero-molecule-svg {
            width: 100%;
            height: auto;
            opacity: 0.9;
        }

        .hero-molecule-label {
            font-family: 'Inter', sans-serif;
            font-size: 0.68rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            opacity: 0.75;
            font-weight: 600;
        }

        .hero-bottom {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .hero-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
        }

        @media (min-width: 768px) {
            .hero-stats-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }

        .hero-kicker {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            width: fit-content;
            padding: 4px 12px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.12);
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            font-weight: 600;
            opacity: 0.95;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }

        .hero-kicker-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #a7f3d0;
            box-shadow: 0 0 0 5px rgba(167, 243, 208, 0.25);
        }

        .hero-highlight {
            background: linear-gradient(90deg, #a7f3d0, #5eead4, #67e8f9, #a7f3d0);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 12px rgba(45, 212, 191, 0.45));
        }

        .hero-quick-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .hero-tag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 11px;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            border: 1px solid rgba(255, 255, 255, 0.22);
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.94);
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .hero-tag::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #5eead4;
            box-shadow: 0 0 8px #2dd4bf;
        }

        @media (hover: hover) {
            .hero-tag:hover {
                background: rgba(255, 255, 255, 0.16);
                border-color: rgba(255, 255, 255, 0.35);
                transform: translateY(-1px);
            }
        }

        .hero-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }

        .hero-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 10px;
            border: 1px solid transparent;
            text-decoration: none;
            font-size: 0.82rem;
            font-weight: 600;
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .hero-btn-primary {
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            color: #0f172a;
            box-shadow: 0 10px 24px -12px rgba(15, 23, 42, 0.7);
        }

        .hero-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px -12px rgba(15, 23, 42, 0.75);
        }

        .hero-btn-secondary {
            background: rgba(255, 255, 255, 0.06);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.28);
            backdrop-filter: blur(8px);
        }

        .hero-btn-secondary:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.45);
        }

        .hero-btn svg {
            flex-shrink: 0;
        }

        .hero-divider {
            height: 1px;
            width: 100%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.07) 72%, rgba(255, 255, 255, 0) 100%);
            position: relative;
            z-index: 1;
        }

        .badge-nie {
            align-self: flex-start;
            background-color: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 0.74rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .sidebar-header .badge-nie {
            background-color: var(--accent-bg);
            border: 1px solid var(--border);
            color: var(--accent);
            backdrop-filter: none;
            font-size: 0.68rem;
            padding: 4px 10px;
        }

        .hero-title {
            font-family: var(--font-heading);
            font-size: clamp(1.7rem, 3.8vw, 2.4rem);
            font-weight: 700;
            line-height: 1.18;
            text-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
            letter-spacing: -0.02em;
            max-width: 20ch;
        }

        .hero-subtitle {
            font-size: clamp(0.92rem, 2vw, 1.05rem);
            font-weight: 500;
            opacity: 0.9;
            max-width: 48ch;
            line-height: 1.5;
        }

        .hero-author {
            font-size: 0.95rem;
            opacity: 0.85;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 20px;
        }

        /* Professional Author Profile Card */
        .author-profile-card {
            display: grid;
            grid-template-columns: 52px 1fr;
            grid-template-areas: "avatar details";
            column-gap: 14px;
            row-gap: 0;
            align-items: center;
            width: 100%;
            margin-top: 0;
            padding: 14px 18px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 14px;
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            position: relative;
            z-index: 1;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
        }

        .author-profile-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 18px;
            right: 18px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .author-avatar {
            grid-area: avatar;
            width: 52px;
            height: 52px;
            border-radius: 12px;
            background: linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08));
            border: 2px solid rgba(255, 255, 255, 0.35);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.04em;
            flex-shrink: 0;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            align-self: center;
        }

        .author-details {
            grid-area: details;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 6px;
            min-width: 0;
            text-align: left;
        }

        .author-label {
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            opacity: 0.8;
            font-weight: 600;
            line-height: 1.2;
            margin: 0;
        }

        .author-info-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px 12px;
            width: 100%;
        }

        .author-name {
            font-family: 'Inter', sans-serif;
            font-size: 1.1rem;
            font-weight: 700;
            line-height: 1.2;
            color: #ffffff;
            margin: 0;
            white-space: nowrap;
        }

        .author-degree {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.76rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
            background: rgba(255, 255, 255, 0.12);
            padding: 4px 11px;
            border-radius: 50px;
            line-height: 1.2;
            white-space: nowrap;
        }

        .author-degree svg {
            flex-shrink: 0;
            opacity: 0.85;
        }

        .author-platform {
            font-size: 0.72rem;
            opacity: 0.75;
            margin: 0;
            line-height: 1.4;
            width: 100%;
        }

        @media (min-width: 640px) {
            .author-info-row {
                flex-wrap: nowrap;
            }
            .author-platform {
                border-top: 1px solid rgba(255, 255, 255, 0.12);
                padding-top: 6px;
                margin-top: 2px;
            }
        }

        /* Quick Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
        }

        .stat-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow);
            border-radius: 16px;
            padding: 20px 24px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            backdrop-filter: blur(12px);
        }

        .hero-section .stat-card {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 12px 14px;
            border-radius: 14px;
            gap: 4px;
            position: relative;
            overflow: hidden;
            transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .hero-section .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #5eead4, transparent);
            opacity: 0.6;
        }

        @media (hover: hover) {
            .hero-section .stat-card:hover {
                transform: translateY(-2px);
                border-color: rgba(255, 255, 255, 0.32);
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%);
            }
        }

        .hero-section .stat-value {
            color: #ecfdf5;
            font-size: 1.35rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        .hero-section .stat-label {
            color: rgba(255, 255, 255, 0.82);
            font-size: 0.7rem;
            line-height: 1.35;
            font-weight: 500;
        }

        .hero-bottom {
            position: relative;
            z-index: 1;
        }

        .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent);
            font-family: var(--font-heading);
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
        }

        /* Lesson Section (Collapsible Accordion) */
        .lesson-section {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 20px;
            box-shadow: var(--shadow);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .lesson-section:hover {
            box-shadow: var(--shadow-hover);
        }

        .lesson-header {
            padding: 24px 32px;
            background-color: var(--bg-secondary);
            border-bottom: 1px solid transparent;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            user-select: none;
            transition: all 0.2s ease;
        }

        .lesson-header:hover {
            background-color: var(--bg-primary);
        }

        .lesson-title-group {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .collapse-arrow {
            color: var(--text-muted);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
        }

        .lesson-section.collapsed .collapse-arrow {
            transform: rotate(0deg);
        }

        .lesson-section:not(.collapsed) .collapse-arrow {
            transform: rotate(90deg);
        }

        .lesson-main-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .lesson-subtitle {
            font-size: 0.95rem;
            color: var(--text-muted);
            display: block;
        }

        .lesson-meta-badges {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .meta-badge {
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .badge-difficulty {
            background-color: rgba(14, 165, 233, 0.1);
            color: #0ea5e9;
        }

        .badge-danger {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        .badge-warning {
            background-color: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .badge-time {
            background-color: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
        }

        /* Lesson Content Container */
        .lesson-content {
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
        }

        .lesson-section.collapsed .lesson-content {
            display: none;
        }

        /* Premium Cards (Styled Callouts) */
        .premium-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 28px;
            box-shadow: var(--shadow);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: relative;
        }

        @media (hover: hover) and (pointer: fine) {
            .premium-card:hover {
                transform: translateY(-3px);
                box-shadow: var(--shadow-hover);
            }
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed var(--border);
        }

        .card-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            flex-shrink: 0;
        }

        .card-title-text {
            font-family: var(--font-heading);
            font-size: 1.2rem;
            font-weight: 700;
        }

        /* Card Custom Themes */
        .card-intro {
            border-left: 5px solid var(--intro-border);
        }
        .card-intro .card-icon {
            background-color: var(--intro-bg-light);
            color: var(--intro-border);
        }
        [data-theme="dark"] .card-intro .card-icon {
            background-color: var(--intro-bg-dark);
        }

        .card-key-concept {
            border-left: 5px solid var(--concept-border);
        }
        .card-key-concept .card-icon {
            background-color: var(--concept-bg-light);
            color: var(--concept-border);
        }
        [data-theme="dark"] .card-key-concept .card-icon {
            background-color: var(--concept-bg-dark);
        }

        .card-exam-tip {
            border-left: 5px solid var(--exam-border);
        }
        .card-exam-tip .card-icon {
            background-color: var(--exam-bg-light);
            color: var(--exam-border);
        }
        [data-theme="dark"] .card-exam-tip .card-icon {
            background-color: var(--exam-bg-dark);
        }

        .card-reminder {
            border-left: 5px solid var(--reminder-border);
        }
        .card-reminder .card-icon {
            background-color: var(--reminder-bg-light);
            color: var(--reminder-border);
        }
        [data-theme="dark"] .card-reminder .card-icon {
            background-color: var(--reminder-bg-dark);
        }

        .card-common-errors {
            border-left: 5px solid var(--error-border);
        }
        .card-common-errors .card-icon {
            background-color: var(--error-bg-light);
            color: var(--error-border);
        }
        [data-theme="dark"] .card-common-errors .card-icon {
            background-color: var(--error-bg-dark);
        }

        .card-summary-notes {
            border-left: 5px solid var(--summary-border);
        }
        .card-summary-notes .card-icon {
            background-color: var(--summary-bg-light);
            color: var(--summary-border);
        }
        [data-theme="dark"] .card-summary-notes .card-icon {
            background-color: var(--summary-bg-dark);
        }

        .card-calculation {
            border-left: 5px solid var(--calc-border);
        }
        .card-calculation .card-icon {
            background-color: var(--calc-bg-light);
            color: var(--calc-border);
        }
        [data-theme="dark"] .card-calculation .card-icon {
            background-color: var(--calc-bg-dark);
        }

        .card-formula {
            border-left: 5px solid var(--formula-border);
        }
        .card-formula .card-icon {
            background-color: var(--formula-bg-light);
            color: var(--formula-border);
        }
        [data-theme="dark"] .card-formula .card-icon {
            background-color: var(--formula-bg-dark);
        }

        .card-definition {
            border-left: 5px solid var(--definition-border);
        }
        .card-definition .card-icon {
            background-color: var(--definition-bg-light);
            color: var(--definition-border);
        }
        [data-theme="dark"] .card-definition .card-icon {
            background-color: var(--definition-bg-dark);
        }

        .card-past-paper {
            border-left: 5px solid var(--pastpaper-border);
        }
        .card-past-paper .card-icon {
            background-color: var(--pastpaper-bg-light);
            color: var(--pastpaper-border);
        }
        [data-theme="dark"] .card-past-paper .card-icon {
            background-color: var(--pastpaper-bg-dark);
        }

        .card-practical {
            border-left: 5px solid var(--practical-border);
        }
        .card-practical .card-icon {
            background-color: var(--practical-bg-light);
            color: var(--practical-border);
        }
        [data-theme="dark"] .card-practical .card-icon {
            background-color: var(--practical-bg-dark);
        }

        /* Typography Inside Cards */
        .card-body p {
            margin-bottom: 14px;
        }

        .card-body p:last-child {
            margin-bottom: 0;
        }

        .card-body ul, .card-body ol {
            margin-left: 24px;
            margin-bottom: 14px;
        }

        .card-body li {
            margin-bottom: 6px;
        }

        /* Styled Tables */
        .table-container {
            width: 100%;
            overflow-x: auto;
            border-radius: 12px;
            border: 1px solid var(--border);
            margin: 16px 0;
        }

        .premium-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.95rem;
        }

        .premium-table th {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-weight: 600;
            padding: 14px 18px;
            border-bottom: 1.5px solid var(--border);
            font-family: var(--font-heading);
        }

        .premium-table td {
            padding: 14px 18px;
            border-bottom: 1px solid var(--border);
            color: var(--text-secondary);
        }

        .premium-table tbody tr:last-child td {
            border-bottom: none;
        }

        .premium-table tbody tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.015);
        }

        [data-theme="dark"] .premium-table tbody tr:nth-child(even) {
            background-color: rgba(255, 255, 255, 0.015);
        }

        .premium-table tbody tr:hover {
            background-color: rgba(13, 148, 136, 0.04);
        }

        /* Code & Formula Blocks */
        .code-block {
            background-color: #0b0f19;
            color: #2dd4bf;
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            margin: 16px 0;
            border: 1px solid #1e293b;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .fira-code {
            font-family: 'Fira Code', 'Courier New', Courier, monospace;
            font-size: 0.88rem;
            line-height: 1.6;
        }

        code {
            font-family: 'Fira Code', monospace;
            background-color: rgba(13, 148, 136, 0.08);
            color: var(--accent);
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 0.9em;
        }

        .math-display-container {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            margin: 16px 0;
            display: flex;
            justify-content: center;
        }

        /* Custom Callout Blocks */
        .callout {
            border-radius: 12px;
            padding: 16px 20px;
            margin: 14px 0;
            display: flex;
            gap: 12px;
            font-size: 0.95rem;
        }

        .callout-info {
            background-color: var(--intro-bg-light);
            border-left: 4px solid var(--intro-border);
            color: var(--text-primary);
        }

        [data-theme="dark"] .callout-info {
            background-color: var(--intro-bg-dark);
        }

        .callout-warning {
            background-color: var(--error-bg-light);
            border-left: 4px solid var(--error-border);
            color: var(--text-primary);
        }

        [data-theme="dark"] .callout-warning {
            background-color: var(--error-bg-dark);
        }

        /* Utility / Small Components */
        .emoji-badge {
            display: inline-block;
            margin-right: 6px;
        }

        .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }

        .dot-red { background-color: #ef4444; }
        .dot-green { background-color: #10b981; }

        .star-icon {
            color: #f59e0b;
            margin-right: 2px;
        }

        .divider-hr {
            border: none;
            height: 1px;
            background-color: var(--border);
            margin: 32px 0;
        }

        /* Highlight feature on search */
        mark {
            background-color: #fef08a;
            color: #0f172a;
            padding: 0 2px;
            border-radius: 4px;
        }

        /* Footer */
        .footer {
            border-top: 1px solid var(--border);
            padding: 40px 0;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 40px;
        }

        .footer-author {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
            padding: 16px 24px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 14px;
            max-width: 520px;
            margin: 0 auto;
        }

        .footer-author-avatar {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--accent), #0f766e);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 0.75rem;
            flex-shrink: 0;
        }

        .footer-author-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            text-align: left;
        }

        .footer-author-name {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--text-primary);
        }

        .footer-author-degree {
            font-size: 0.8rem;
            color: var(--accent);
            font-weight: 500;
        }

        .footer-copy {
            font-size: 0.82rem;
            opacity: 0.75;
        }

        .footer-note {
            font-size: 0.8rem;
            opacity: 0.7;
            max-width: 640px;
            margin: 0 auto;
            line-height: 1.6;
        }

        /* Mobile Top Navigation Bar */
        .mobile-topbar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: calc(52px + env(safe-area-inset-top, 0px));
            padding-top: env(safe-area-inset-top, 0px);
            padding-left: max(12px, env(safe-area-inset-left, 0px));
            padding-right: max(12px, env(safe-area-inset-right, 0px));
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            z-index: 120;
            align-items: center;
            gap: 12px;
        }

        .topbar-menu-btn,
        .topbar-theme-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            min-width: 44px;
            border: none;
            border-radius: 12px;
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s ease;
            touch-action: manipulation;
        }

        .topbar-menu-btn:hover,
        .topbar-theme-btn:hover {
            background: var(--bg-primary);
            color: var(--accent);
        }

        .topbar-title {
            flex: 1;
            font-family: var(--font-heading);
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.3;
        }

        /* Float Action Buttons / Mobile Menu Trigger (fallback) */
        .mobile-menu-btn {
            display: none;
            position: fixed;
            bottom: max(24px, env(safe-area-inset-bottom, 0px));
            right: max(24px, env(safe-area-inset-right, 0px));
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: var(--accent);
            color: #ffffff;
            border: none;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            z-index: 150;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, background-color 0.2s ease;
            touch-action: manipulation;
        }

        @media (hover: hover) and (pointer: fine) {
            .mobile-menu-btn:hover {
                transform: scale(1.05);
                background-color: var(--accent-hover);
            }
        }

        .mobile-menu-btn:active {
            transform: scale(0.96);
        }

        /* Mobile Overlay Background Backdrop */
        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            height: 100dvh;
            background-color: rgba(9, 13, 22, 0.5);
            backdrop-filter: blur(4px);
            z-index: 125;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .sidebar-overlay.open {
            display: block;
            opacity: 1;
            pointer-events: auto;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
            .mobile-topbar {
                display: flex;
            }
            .progress-bar-container {
                top: calc(52px + env(safe-area-inset-top, 0px));
            }
            .sidebar {
                transform: translateX(-100%);
                width: min(300px, 86vw);
                max-width: 86vw;
                z-index: 130;
                padding-bottom: env(safe-area-inset-bottom, 0px);
                box-shadow: none;
            }
            .sidebar.open {
                transform: translateX(0);
                box-shadow: 8px 0 40px rgba(0, 0, 0, 0.25);
            }
            .sidebar-close-btn {
                display: flex;
            }
            .main-content {
                margin-left: 0;
                width: 100%;
                max-width: 100%;
                padding: calc(64px + env(safe-area-inset-top, 0px)) 16px 40px;
                padding-left: max(16px, env(safe-area-inset-left, 0px));
                padding-right: max(16px, env(safe-area-inset-right, 0px));
                padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));
                gap: 20px;
            }
            .mobile-menu-btn {
                display: none;
            }
            .search-input {
                font-size: 16px;
            }
            .hero-section {
                border-radius: 16px;
            }
            .hero-section > .hero-shell {
                padding: 20px 18px;
                gap: 14px;
            }
            .hero-bottom {
                gap: 10px;
            }
            .hero-stats-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px;
            }
            .hero-title {
                font-size: clamp(1.5rem, 5vw, 2rem);
                word-break: break-word;
            }
            .hero-subtitle {
                font-size: 1.15rem;
            }
            .hero-main {
                gap: 10px;
            }
            .hero-kicker {
                font-size: 0.7rem;
            }
            .hero-actions {
                gap: 10px;
            }
            .hero-btn {
                font-size: 0.82rem;
                padding: 9px 14px;
            }
            .author-profile-card {
                grid-template-columns: 48px 1fr;
                column-gap: 12px;
                padding: 12px 14px;
            }
            .author-avatar {
                width: 48px;
                height: 48px;
                font-size: 0.95rem;
            }
            .author-name {
                font-size: 1rem;
            }
            .author-degree {
                font-size: 0.74rem;
            }
            .author-info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;
            }
            .logo-title {
                font-size: 1.1rem;
            }
            .card-body ul, .card-body ol {
                margin-left: 20px;
            }
            .card-title-text {
                font-size: 1.05rem;
            }
            .code-block, .math-display-container {
                max-width: 100%;
            }
            
            /* Spacing optimization inside cards for small screens */
            .lesson-content {
                padding: 16px;
                gap: 16px;
            }
            
            .premium-card {
                padding: 18px 16px;
                gap: 12px;
                border-radius: 12px;
            }
            
            .lesson-header {
                padding: 18px 16px;
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            
            .lesson-title-group {
                gap: 12px;
                width: 100%;
            }
            
            .lesson-main-title {
                font-size: 1.25rem;
                word-break: break-word;
            }
            
            .lesson-meta-badges {
                gap: 8px;
                width: 100%;
            }
            
            .meta-badge {
                padding: 4px 10px;
                font-size: 0.75rem;
            }
            
            .table-container {
                margin: 12px 0;
                border-radius: 8px;
                -webkit-overflow-scrolling: touch;
            }
            
            .premium-table th, .premium-table td {
                padding: 10px 12px;
                font-size: 0.85rem;
            }
            .footer {
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
        }
        
        @media (max-width: 480px) {
            .main-content {
                padding-top: calc(60px + env(safe-area-inset-top, 0px));
                gap: 18px;
            }
            .stats-grid {
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .stat-card {
                padding: 12px;
                border-radius: 12px;
            }
            
            .stat-value {
                font-size: 1.35rem;
            }
            
            .stat-label {
                font-size: 0.7rem;
            }
            
            .hero-section > .hero-shell {
                padding: 16px 14px;
                gap: 12px;
            }
            .hero-title {
                font-size: 1.5rem;
            }
            
            .hero-subtitle {
                font-size: 1rem;
            }
            .hero-actions {
                width: 100%;
            }
            .hero-btn {
                flex: 1 1 calc(50% - 6px);
                justify-content: center;
            }
            .hero-kicker {
                letter-spacing: 0.05em;
            }
            .hero-tag {
                font-size: 0.72rem;
                padding: 5px 10px;
            }
            .author-profile-card {
                grid-template-columns: 44px 1fr;
                column-gap: 10px;
                padding: 12px;
            }
            .author-name {
                white-space: normal;
            }
            .author-degree {
                white-space: normal;
            }
            .author-info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            .author-platform {
                font-size: 0.68rem;
            }
            .hero-section .stat-card {
                padding: 8px 10px;
            }
            .hero-section .stat-value {
                font-size: 1.1rem;
            }
            .author-avatar {
                width: 48px;
                height: 48px;
                font-size: 0.95rem;
            }
            .author-name {
                font-size: 1.1rem;
            }
            .author-degree {
                font-size: 0.78rem;
                padding: 3px 10px;
            }
            .author-platform {
                font-size: 0.72rem;
            }
            .footer-author {
                flex-direction: column;
                text-align: center;
                padding: 14px 16px;
            }
            .footer-author-text {
                align-items: center;
                text-align: center;
            }
            .badge-nie {
                font-size: 0.72rem;
                padding: 5px 12px;
            }
            .sidebar-nav-item {
                padding: 12px 14px;
            }
            .sidebar-author {
                padding: 12px 16px;
            }
            .sidebar-header {
                padding: 16px;
            }
            .lesson-content {
                padding: 12px;
            }
        }

        @media (max-width: 360px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .hero-title {
                font-size: 1.35rem;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *, html {
                scroll-behavior: auto;
                transition-duration: 0.01ms !important;
            }
        }

        /* Print styles */
        @media print {
            .sidebar, .mobile-menu-btn, .mobile-topbar, .progress-bar-container, .control-btn, .search-container {
                display: none !important;
            }
            body {
                background-color: #ffffff !important;
                color: #000000 !important;
            }
            .main-content {
                margin-left: 0 !important;
                width: 100% !important;
                padding: 0 !important;
            }
            .premium-card {
                box-shadow: none !important;
                border: 1px solid #cccccc !important;
                page-break-inside: avoid;
            }
            .lesson-section {
                border: none !important;
                box-shadow: none !important;
                page-break-before: always;
            }
            .lesson-content {
                display: flex !important;
            }
            .lesson-header {
                border-bottom: 2px solid #000000 !important;
                background-color: transparent !important;
            }
            .collapse-arrow {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <!-- Mobile Top Navigation Bar -->
    <header class="mobile-topbar" id="mobileTopbar">
        <button class="topbar-menu-btn" id="topbarMenuBtn" onclick="toggleMobileSidebar()" aria-label="Open navigation menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" id="topbarMenuIcon"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span class="topbar-title">க.பொ.த இரசாயனவியல்</span>
        <button class="topbar-theme-btn" onclick="toggleTheme()" aria-label="Toggle theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="topbarThemeIcon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
    </header>

    <!-- Mobile Sidebar Overlay Backdrop -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleMobileSidebar()" aria-hidden="true"></div>

    <!-- Top Reading Progress Bar -->
    <div class="progress-bar-container">
        <div class="progress-bar" id="readingProgress"></div>
    </div>

    <!-- Sticky Navigation Sidebar -->
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
        <div class="sidebar-header">
            <div class="sidebar-header-top">
                <span class="badge-nie">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    NIE Sri Lanka Standard
                </span>
                <button class="sidebar-close-btn" onclick="toggleMobileSidebar()" aria-label="Close navigation menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <h1 class="logo-title">க.பொ.த (உயர் தரம்) இரசாயனவியல்</h1>
            <span class="logo-tag">தமிழ் மொழிமூல வளநூல் அறிவுத் தளம்</span>
        </div>

        <div class="sidebar-author">
            <div class="sidebar-author-avatar" aria-hidden="true">${AUTHOR.initials}</div>
            <div class="sidebar-author-info">
                <span class="sidebar-author-label">Prepared &amp; Analyzed by</span>
                <span class="sidebar-author-name">${AUTHOR.name}</span>
                <span class="sidebar-author-degree">${AUTHOR.degree}</span>
            </div>
        </div>
        
        <!-- Search bar -->
        <div class="search-container">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" id="searchInput" placeholder="பாடங்களைத் தேடுக..." oninput="handleSearch()">
        </div>
        
        <!-- Table of Contents Menu -->
        <nav class="sidebar-menu" id="sidebarMenu">
            ${sidebarNavHtml.join("\n")}
        </nav>
        
        <!-- Theme and action controls -->
        <div class="sidebar-footer">
            <button class="control-btn" id="themeToggle" onclick="toggleTheme()" title="Theme Toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="themeIcon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </button>
            <button class="control-btn" onclick="toggleAllLessons(true)" title="Expand All Lessons">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18M3 16h18M12 4v8M12 12v8"/></svg>
            </button>
            <button class="control-btn" onclick="toggleAllLessons(false)" title="Collapse All Lessons">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18M3 16h18"/></svg>
            </button>
            <button class="control-btn" onclick="window.print()" title="Print Notes">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
        </div>
    </aside>

    <!-- Main Content Panel -->
    <main class="main-content">
        
        <!-- Premium Hero Header -->
        <header class="hero-section">
            <div class="hero-shell">
                <div class="hero-bg" aria-hidden="true">
                    <div class="hero-bg-mesh"></div>
                    <div class="hero-bg-grid"></div>
                    <div class="hero-orb hero-orb-1"></div>
                    <div class="hero-orb hero-orb-2"></div>
                </div>

                <div class="hero-inner">
                    <div class="hero-main">
                        <span class="badge-nie">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                            தேசிய கல்வி நிறுவகம் (NIE) இலங்கை
                        </span>
                        <span class="hero-kicker"><span class="hero-kicker-dot"></span> Professional Study Hub</span>
                        <h1 class="hero-title">க.பொ.த (உயர் தரம்) <span class="hero-highlight">இரசாயனவியல்</span></h1>
                        <p class="hero-subtitle">தமிழ் மொழிமூல முழுமையான அறிவுத் தளம் — பாட வழிகாட்டல், முக்கிய கருத்துக்கள் &amp; பரீட்சை மீளாய்வு.</p>
                        <div class="hero-quick-tags">
                            <span class="hero-tag">NIE Aligned</span>
                            <span class="hero-tag">Exam Focused</span>
                            <span class="hero-tag">Tamil Medium</span>
                        </div>
                        <div class="hero-actions">
                            <a href="#welcome-section" class="hero-btn hero-btn-primary" onclick="showAndScrollTo('welcome-section', event)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                Start Learning
                            </a>
                            <a href="#final-revision" class="hero-btn hero-btn-secondary" onclick="showAndScrollTo('final-revision', event)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                                Final Revision
                            </a>
                        </div>
                    </div>

                    <div class="hero-visual" aria-hidden="true">
                        <div class="hero-molecule-card">
                            <svg class="hero-molecule-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="28" r="10" stroke="rgba(255,255,255,0.7)" stroke-width="2" fill="rgba(45,212,191,0.25)"/>
                                <circle cx="32" cy="72" r="10" stroke="rgba(255,255,255,0.7)" stroke-width="2" fill="rgba(56,189,248,0.2)"/>
                                <circle cx="88" cy="72" r="10" stroke="rgba(255,255,255,0.7)" stroke-width="2" fill="rgba(167,243,208,0.2)"/>
                                <circle cx="60" cy="92" r="8" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="rgba(255,255,255,0.08)"/>
                                <line x1="60" y1="38" x2="38" y2="64" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                                <line x1="60" y1="38" x2="82" y2="64" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                                <line x1="42" y1="72" x2="78" y2="72" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                                <line x1="60" y1="80" x2="60" y2="84" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                            </svg>
                            <span class="hero-molecule-label">Chemistry Core</span>
                        </div>
                    </div>
                </div>

                <div class="hero-divider"></div>

                <div class="hero-bottom">
                    <div class="stats-grid hero-stats-grid">
                        <div class="stat-card">
                            <span class="stat-value">14</span>
                            <span class="stat-label">பாட அலகுகள்</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">100+</span>
                            <span class="stat-label">முக்கிய கருத்துக்கள்</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">250+</span>
                            <span class="stat-label">படிப்பு மணித்தியாலங்கள்</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">A/L</span>
                            <span class="stat-label">பரீட்சை வழிகாட்டல்கள்</span>
                        </div>
                    </div>

                    <div class="author-profile-card">
                        <div class="author-avatar" aria-hidden="true">${AUTHOR.initials}</div>
                        <div class="author-details">
                            <span class="author-label">Prepared &amp; Analyzed by</span>
                            <div class="author-info-row">
                                <h2 class="author-name">${AUTHOR.name}</h2>
                                <span class="author-degree">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                                    ${AUTHOR.degree}
                                </span>
                            </div>
                            <span class="author-platform">${AUTHOR.platform}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Lessons Container -->
        <div class="lessons-container" id="lessonsContainer">
            ${welcomeSectionHtml}
            ${convertedSections.join("\n")}
        </div>

        <!-- Elegant Footer -->
        <footer class="footer">
            <div class="footer-author">
                <div class="footer-author-avatar" aria-hidden="true">${AUTHOR.initials}</div>
                <div class="footer-author-text">
                    <span class="footer-author-name">${AUTHOR.name}</span>
                    <span class="footer-author-degree">${AUTHOR.degree}</span>
                </div>
            </div>
            <p class="footer-copy">© ${AUTHOR.platform}</p>
            <p class="footer-note">பாடத்திட்ட குறிப்புகள் மற்றும் பகுப்பாய்வுகள் தேசிய கல்வி நிறுவகத்தின் வளநூல்களின் அடிப்படையில் வடிவமைக்கப்பட்டுள்ளன.</p>
        </footer>
    </main>

    <!-- Mobile Navigation Toggle Button -->
    <button class="mobile-menu-btn" onclick="toggleMobileSidebar()" title="Toggle Sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" id="menuIcon"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>

    <!-- Premium Interactions Javascript -->
    <script>
        // Set Default Dark/Light Theme based on storage or preference
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        function toggleTheme() {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }

        function updateThemeIcon(theme) {
            const icon = document.getElementById('themeIcon');
            const topbarIcon = document.getElementById('topbarThemeIcon');
            const darkSvg = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
            const lightSvg = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
            const svg = theme === 'dark' ? darkSvg : lightSvg;
            if (icon) icon.innerHTML = svg;
            if (topbarIcon) topbarIcon.innerHTML = svg;
        }

        const MENU_ICON_OPEN = '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>';
        const MENU_ICON_CLOSE = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

        function updateMenuIcons(isOpen) {
            const menuIcon = document.getElementById('menuIcon');
            const topbarIcon = document.getElementById('topbarMenuIcon');
            const topbarBtn = document.getElementById('topbarMenuBtn');
            const icon = isOpen ? MENU_ICON_CLOSE : MENU_ICON_OPEN;
            if (menuIcon) menuIcon.innerHTML = icon;
            if (topbarIcon) topbarIcon.innerHTML = icon;
            if (topbarBtn) topbarBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        function isMobileViewport() {
            return window.matchMedia('(max-width: 1024px)').matches;
        }

        // Lesson Accordion Toggle
        function toggleLesson(lessonId) {
            const el = document.getElementById(lessonId);
            if (el.classList.contains('collapsed')) {
                el.classList.remove('collapsed');
            } else {
                el.classList.add('collapsed');
            }
        }

        // Expand or Collapse All lessons
        function toggleAllLessons(expand) {
            const lessons = document.querySelectorAll('.lesson-section');
            lessons.forEach(l => {
                if (expand) {
                    l.classList.remove('collapsed');
                } else {
                    l.classList.add('collapsed');
                }
            });
        }

        // Smooth sidebar scroll and auto-expand target lesson
        function showAndScrollTo(lessonId, event) {
            if (event) event.preventDefault();
            const el = document.getElementById(lessonId);
            if (el) {
                el.classList.remove('collapsed');
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                
                // Active nav item class
                document.querySelectorAll('.sidebar-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                const navItem = document.querySelector(\'a[href="#\' + lessonId + \'"]\');
                if (navItem) navItem.classList.add(\'active\');
                
                // Close mobile sidebar if open
                const sidebar = document.getElementById('sidebar');
                if (sidebar.classList.contains('open')) {
                    toggleMobileSidebar();
                }
            }
        }

        // Mobile Sidebar Trigger
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                sidebar.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('open');
                    overlay.setAttribute('aria-hidden', 'true');
                }
                document.body.classList.remove('sidebar-open');
                document.body.style.overflow = '';
                updateMenuIcons(false);
            } else {
                sidebar.classList.add('open');
                if (overlay) {
                    overlay.classList.add('open');
                    overlay.setAttribute('aria-hidden', 'false');
                }
                if (isMobileViewport()) {
                    document.body.classList.add('sidebar-open');
                    document.body.style.overflow = 'hidden';
                }
                updateMenuIcons(true);
            }
        }

        function closeMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                toggleMobileSidebar();
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileSidebar();
        });

        window.addEventListener('resize', () => {
            if (!isMobileViewport()) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    if (overlay) {
                        overlay.classList.remove('open');
                        overlay.setAttribute('aria-hidden', 'true');
                    }
                    document.body.classList.remove('sidebar-open');
                    document.body.style.overflow = '';
                    updateMenuIcons(false);
                }
            }
        });

        // Reading Progress Indicator
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            document.getElementById('readingProgress').style.width = scrolled + '%';
            
            // Highlight active sidebar menu item based on scroll position
            const sections = document.querySelectorAll('.lesson-section, #welcome-section');
            let activeId = "";
            sections.forEach(sec => {
                const top = sec.offsetTop;
                if (window.scrollY >= top - 220) {
                    activeId = sec.getAttribute('id');
                }
            });
            
            if (activeId) {
                document.querySelectorAll('.sidebar-nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === \'#\' + activeId) {
                        item.classList.add('active');
                    }
                });
            }
        });

        // Live Search Filtering
        function handleSearch() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const navItems = document.querySelectorAll('.sidebar-nav-item');
            const cards = document.querySelectorAll('.premium-card');
            const sections = document.querySelectorAll('.lesson-section');

            if (!query) {
                // Reset search
                navItems.forEach(item => item.style.display = 'flex');
                cards.forEach(card => {
                    card.style.display = 'flex';
                    removeHighlights(card);
                });
                sections.forEach(sec => {
                    sec.style.display = 'block';
                });
                return;
            }

            // Filter side navigation
            navItems.forEach(item => {
                const txt = item.textContent.toLowerCase();
                if (txt.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });

            // Filter cards inside lessons and highlight
            sections.forEach(sec => {
                let hasVisibleCards = false;
                const secCards = sec.querySelectorAll('.premium-card');
                
                secCards.forEach(card => {
                    const cardText = card.textContent.toLowerCase();
                    if (cardText.includes(query)) {
                        card.style.display = 'flex';
                        hasVisibleCards = true;
                        applyHighlights(card, query);
                    } else {
                        card.style.display = 'none';
                        removeHighlights(card);
                    }
                });

                // Check section title as well
                const secTitle = sec.querySelector('.lesson-main-title').textContent.toLowerCase();
                if (secTitle.includes(query) || hasVisibleCards) {
                    sec.style.display = 'block';
                    sec.classList.remove('collapsed'); // Auto-expand matching sections
                } else {
                    sec.style.display = 'none';
                }
            });
        }

        // Helper highlight scripts
        function applyHighlights(root, word) {
            removeHighlights(root);
            
            // Highlight text node occurrences recursively
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            const nodes = [];
            while(walker.nextNode()) nodes.push(walker.currentNode);
            
            nodes.forEach(node => {
                const val = node.nodeValue;
                const lowerVal = val.toLowerCase();
                const index = lowerVal.indexOf(word);
                
                // Skip script, style or inside equations
                if (node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE' || 
                    node.parentElement.tagName === 'CODE' ||
                    node.parentElement.closest('.math-display-container')) {
                    return;
                }
                
                if (index >= 0) {
                    const span = document.createElement('span');
                    span.className = 'highlight-temp-wrapper';
                    
                    let lastIdx = 0;
                    let nextIdx = lowerVal.indexOf(word, lastIdx);
                    
                    while (nextIdx >= 0) {
                        span.appendChild(document.createTextNode(val.substring(lastIdx, nextIdx)));
                        const mark = document.createElement('mark');
                        mark.appendChild(document.createTextNode(val.substring(nextIdx, nextIdx + word.length)));
                        span.appendChild(mark);
                        lastIdx = nextIdx + word.length;
                        nextIdx = lowerVal.indexOf(word, lastIdx);
                    }
                    span.appendChild(document.createTextNode(val.substring(lastIdx)));
                    node.parentNode.replaceChild(span, node);
                }
            });
        }

        function removeHighlights(root) {
            const marks = root.querySelectorAll('mark');
            marks.forEach(mark => {
                const parent = mark.parentNode;
                if (parent.className === 'highlight-temp-wrapper') {
                    const grandParent = parent.parentNode;
                    grandParent.replaceChild(document.createTextNode(parent.textContent), parent);
                } else {
                    parent.replaceChild(document.createTextNode(mark.textContent), mark);
                }
            });
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(outputPath, finalHtml, 'utf8');
fs.writeFileSync(indexPath, finalHtml, 'utf8');
console.log("HTML compilation completed successfully!");
console.log(`  → ${outputPath}`);
console.log(`  → ${indexPath}`);
