/* COSMAEON — Portfolio Diagnostics, Simulation, Theme Switcher & DB Console Script */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. DYNAMIC THEME & FONT SELECTORS
    // =========================================================================
    const themeSelect = document.getElementById('theme-select');
    const fontSelect = document.getElementById('font-select');
    
    // Default values to Slate and Sans (Inter) if not saved
    if (!localStorage.getItem('cosmaeon-theme')) {
        localStorage.setItem('cosmaeon-theme', 'slate');
    }
    if (!localStorage.getItem('cosmaeon-font')) {
        localStorage.setItem('cosmaeon-font', 'technical');
    }

    const applyThemeAndFont = (theme, font) => {
        // Remove old classes
        document.body.classList.remove('theme-sovereign', 'theme-slate', 'theme-light');
        document.body.classList.remove('font-editorial', 'font-technical', 'font-mono');
        
        // Add new classes
        document.body.classList.add(`theme-${theme}`);
        document.body.classList.add(`font-${font}`);
    };

    // Apply saved theme and font on load
    const savedTheme = localStorage.getItem('cosmaeon-theme');
    const savedFont = localStorage.getItem('cosmaeon-font');
    applyThemeAndFont(savedTheme, savedFont);

    if (themeSelect && fontSelect) {
        themeSelect.value = savedTheme;
        fontSelect.value = savedFont;
        
        const handleSelectChange = () => {
            const selectedTheme = themeSelect.value;
            const selectedFont = fontSelect.value;
            localStorage.setItem('cosmaeon-theme', selectedTheme);
            localStorage.setItem('cosmaeon-font', selectedFont);
            applyThemeAndFont(selectedTheme, selectedFont);
        };
        
        themeSelect.addEventListener('change', handleSelectChange);
        fontSelect.addEventListener('change', handleSelectChange);
    }

    // =========================================================================
    // 2. B2C / B2B SEGMENT TOGGLE MECHANICS
    // =========================================================================
    const tabB2C = document.getElementById('tab-b2c');
    const tabB2B = document.getElementById('tab-b2b');
    const segmentB2C = document.getElementById('segment-b2c');
    const segmentB2B = document.getElementById('segment-b2b');

    if (tabB2C && tabB2B && segmentB2C && segmentB2B) {
        const switchSegment = (active) => {
            if (active === 'b2c') {
                segmentB2C.style.display = 'grid';
                segmentB2B.style.display = 'none';
                
                tabB2C.className = 'btn btn-primary';
                tabB2C.style.backgroundColor = 'var(--color-accent)';
                tabB2C.style.color = 'var(--color-bg-base)';
                tabB2C.style.border = '1px solid var(--color-accent)';
                
                tabB2B.className = 'btn btn-secondary';
                tabB2B.style.background = 'transparent';
                tabB2B.style.color = 'var(--text-primary)';
                tabB2B.style.border = 'none';
            } else {
                segmentB2C.style.display = 'none';
                segmentB2B.style.display = 'grid';
                
                tabB2B.className = 'btn btn-primary';
                tabB2B.style.backgroundColor = 'var(--color-accent)';
                tabB2B.style.color = 'var(--color-bg-base)';
                tabB2B.style.border = '1px solid var(--color-accent)';
                
                tabB2C.className = 'btn btn-secondary';
                tabB2C.style.background = 'transparent';
                tabB2C.style.color = 'var(--text-primary)';
                tabB2C.style.border = 'none';
            }
        };

        tabB2C.addEventListener('click', () => switchSegment('b2c'));
        tabB2B.addEventListener('click', () => switchSegment('b2b'));
    }

    // =========================================================================
    // 3. INTERACTIVE CONFLICT & OVERLAP SIMULATOR (HOMEPAGE)
    // =========================================================================
    const slideBank = document.getElementById('slide-bank');
    const slideBroker = document.getElementById('slide-broker');
    const slideAgent = document.getElementById('slide-agent');
    
    const valBank = document.getElementById('val-bank');
    const valBroker = document.getElementById('val-broker');
    const valAgent = document.getElementById('val-agent');

    const simAum = document.getElementById('sim-aum');
    const btnRecalculateSim = document.getElementById('btn-recalculate-sim');

    const balanceSliders = (changedSlider) => {
        let bankVal = parseInt(slideBank.value);
        let brokerVal = parseInt(slideBroker.value);
        let agentVal = parseInt(slideAgent.value);
        
        const sum = bankVal + brokerVal + agentVal;
        
        if (sum !== 100) {
            const diff = 100 - sum;
            
            // Distribute difference between the other two sliders
            if (changedSlider === 'bank') {
                const otherSum = brokerVal + agentVal;
                if (otherSum > 0) {
                    slideBroker.value = Math.max(0, brokerVal + Math.round(diff * (brokerVal / otherSum)));
                    slideAgent.value = Math.max(0, 100 - bankVal - parseInt(slideBroker.value));
                } else {
                    slideBroker.value = Math.round(diff / 2);
                    slideAgent.value = 100 - bankVal - parseInt(slideBroker.value);
                }
            } else if (changedSlider === 'broker') {
                const otherSum = bankVal + agentVal;
                if (otherSum > 0) {
                    slideBank.value = Math.max(0, bankVal + Math.round(diff * (bankVal / otherSum)));
                    slideAgent.value = Math.max(0, 100 - brokerVal - parseInt(slideBank.value));
                } else {
                    slideBank.value = Math.round(diff / 2);
                    slideAgent.value = 100 - brokerVal - parseInt(slideBank.value);
                }
            } else if (changedSlider === 'agent') {
                const otherSum = bankVal + brokerVal;
                if (otherSum > 0) {
                    slideBank.value = Math.max(0, bankVal + Math.round(diff * (bankVal / otherSum)));
                    slideBroker.value = Math.max(0, 100 - agentVal - parseInt(slideBank.value));
                } else {
                    slideBank.value = Math.round(diff / 2);
                    slideBroker.value = 100 - agentVal - parseInt(slideBank.value);
                }
            }
        }
        
        // Update label readouts
        valBank.innerText = `${slideBank.value}%`;
        valBroker.innerText = `${slideBroker.value}%`;
        valAgent.innerText = `${slideAgent.value}%`;
    };

    if (slideBank && slideBroker && slideAgent) {
        slideBank.addEventListener('input', () => balanceSliders('bank'));
        slideBroker.addEventListener('input', () => balanceSliders('broker'));
        slideAgent.addEventListener('input', () => balanceSliders('agent'));
        
        // Run initial update
        balanceSliders();
    }

    const runDiagnosticsAudit = () => {
        if (!simAum || !slideBank) return;
        
        let aum = parseFloat(simAum.value); // In Crores
        if (isNaN(aum) || aum < 0) {
            aum = 0;
        }
        const bankPct = parseInt(slideBank.value) / 100;
        const brokerPct = parseInt(slideBroker.value) / 100;
        const agentPct = parseInt(slideAgent.value) / 100;

        // Calculate holding overlaps
        const relianceOverlap = Math.round((bankPct * 32) + (brokerPct * 22) + (agentPct * 4));
        const hdfcOverlap = Math.round((bankPct * 26) + (brokerPct * 16) + (agentPct * 6));

        // Update Overlap UI
        const labelReliance = document.getElementById('overlap-reliance');
        const barReliance = document.getElementById('bar-reliance');
        const labelHdfc = document.getElementById('overlap-hdfc');
        const barHdfc = document.getElementById('bar-hdfc');

        if (labelReliance && barReliance) {
            labelReliance.innerText = `${relianceOverlap}% Overlap`;
            barReliance.style.width = `${relianceOverlap}%`;
            labelReliance.style.color = relianceOverlap > 20 ? 'var(--color-danger)' : 'var(--color-accent)';
            barReliance.style.backgroundColor = relianceOverlap > 20 ? 'var(--color-danger)' : 'var(--color-accent)';
        }

        if (labelHdfc && barHdfc) {
            labelHdfc.innerText = `${hdfcOverlap}% Overlap`;
            barHdfc.style.width = `${hdfcOverlap}%`;
            labelHdfc.style.color = hdfcOverlap > 20 ? 'var(--color-danger)' : 'var(--color-accent)';
            barHdfc.style.backgroundColor = hdfcOverlap > 20 ? 'var(--color-danger)' : 'var(--color-accent)';
        }

        // Calculate fee drag
        const bankFeeRate = 0.018;
        const brokerFeeRate = 0.010;
        const agentFeeRate = 0.040;

        const weightedFeeRate = (bankPct * bankFeeRate) + (brokerPct * brokerFeeRate) + (agentPct * agentFeeRate);
        const annualLeakage = aum * weightedFeeRate;

        // Compounded opportunity loss
        const expectedGrowth = 0.09;
        const compoundedNormally = aum * Math.pow(1 + expectedGrowth, 10);
        const compoundedWithLeakage = aum * Math.pow(1 + (expectedGrowth - weightedFeeRate), 10);
        const tenYearOpportunityLoss = compoundedNormally - compoundedWithLeakage;

        // Fiduciary fee retainer
        const cosmaeonAdvisoryRetainer = Math.min(0.06, aum * 0.0008); 

        const formatRupees = (crores) => {
            if (crores >= 1) {
                return `₹${crores.toFixed(2)} Cr`;
            } else {
                const lakhs = crores * 100;
                return `₹${lakhs.toFixed(1)} Lakhs`;
            }
        };

        document.getElementById('sim-annual-leak').innerText = formatRupees(annualLeakage);
        document.getElementById('sim-ten-year-loss').innerText = formatRupees(tenYearOpportunityLoss);
        document.getElementById('sim-cosmaeon-fee').innerText = formatRupees(cosmaeonAdvisoryRetainer);
    };

    if (btnRecalculateSim) {
        btnRecalculateSim.addEventListener('click', runDiagnosticsAudit);
        runDiagnosticsAudit();
    }

    // =========================================================================
    // 4. CLIENT PORTAL REGIME SIMULATOR (DASHBOARD)
    // =========================================================================
    const btnSimulateRegime = document.getElementById('btn-simulate-regime');
    if (btnSimulateRegime) {
        btnSimulateRegime.addEventListener('click', () => {
            const regimeSelect = document.getElementById('regime-selector');
            const selectedRegime = regimeSelect ? regimeSelect.value : 'growth';
            
            const bars = document.querySelectorAll('.chart-bar');
            const regimeCoefficients = {
                growth: [80, 45, 60, 20],      
                inflation: [40, 20, 85, 50],   
                liquidity: [25, 65, 30, 90],   
                stagflation: [30, 35, 45, 55]  
            };
            
            const coefficients = regimeCoefficients[selectedRegime] || [60, 40, 50, 30];
            
            bars.forEach((bar, index) => {
                const heightPercent = coefficients[index];
                bar.style.height = `${heightPercent}%`;
                
                let statusLabel = 'STABLE';
                let color = 'var(--color-accent)';
                
                if (selectedRegime === 'inflation' && index === 2) { 
                    statusLabel = 'APPRECIATING';
                    color = 'var(--color-success)';
                } else if (selectedRegime === 'liquidity' && index === 0) { 
                    statusLabel = 'HIGH VOLATILITY';
                    color = 'var(--color-danger)';
                } else if (selectedRegime === 'liquidity' && index === 3) { 
                    statusLabel = 'HIGH YIELD';
                    color = 'var(--color-success)';
                }
                
                bar.style.borderColor = color;
                bar.style.backgroundColor = color === 'var(--color-accent)' ? 'var(--color-accent-dim)' : color + '22';
                bar.setAttribute('data-label', `${heightPercent}% — ${statusLabel}`);
            });
            
            const alertBox = document.getElementById('stress-alert-box');
            if (alertBox) {
                alertBox.style.display = 'flex';
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // =========================================================================
    // 5. SECURE DATABASE VAULT CONSOLE INTERPRETER (B2B/ADMIN)
    // =========================================================================
    const btnRunQuery = document.getElementById('btn-run-query');
    const dbQueryInput = document.getElementById('db-query-input');
    const decryptToggle = document.getElementById('decrypt-toggle');
    const consoleOutput = document.getElementById('db-console-output');
    const dbPresets = document.querySelectorAll('.db-preset');

    if (btnRunQuery && dbQueryInput && consoleOutput) {
        
        // Setup presets
        dbPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                e.preventDefault();
                dbQueryInput.value = preset.getAttribute('data-query');
                btnRunQuery.click();
            });
        });

        // Query execution logic
        btnRunQuery.addEventListener('click', () => {
            const query = dbQueryInput.value.trim();
            const decryptAuthorized = decryptToggle ? decryptToggle.checked : false;
            
            // Console logging phase
            consoleOutput.innerHTML = `
<span style="color: var(--text-muted);">[SYSTEM] Initiating zero-trust audit...</span><br>
<span style="color: var(--text-muted);">[ABAC] Validating IP 103.220.44.11 client role 'family_office_admin'... Passed.</span><br>
<span style="color: var(--text-muted);">[KMS] Cryptographic decryption token: ${decryptAuthorized ? 'AUTHORIZED (FIDUCIARY_KEY)' : 'DENIED (MASKING ACTIVE)'}</span><br>
<span style="color: var(--color-accent);">[DB] Executing query: "${query}"</span><br><br>
            `;

            setTimeout(() => {
                let htmlTable = '';
                const queryLower = query.toLowerCase();
                const isSelect = queryLower.startsWith('select');
                const containsDestructive = queryLower.includes('drop') || 
                                             queryLower.includes('delete') || 
                                             queryLower.includes('truncate') || 
                                             queryLower.includes('insert') || 
                                             queryLower.includes('update') || 
                                             queryLower.includes('alter') || 
                                             queryLower.includes('grant');

                if (!isSelect || containsDestructive) {
                    htmlTable = `<span style="color: var(--color-danger); font-weight: bold;">[SECURITY ALERT] Transaction Terminated: Write operations are strictly blocked under zero-trust Read-Only Audit policy (ABAC Rule #12). Role 'family_office_admin' lacks write authority.</span>`;
                } else if (queryLower.includes('users')) {
                    // Render Users Table
                    const email1 = decryptAuthorized ? 'trustee@birlaoffice.in' : '\\x7d39a820b16f39e8a1f28b...';
                    const token1 = decryptAuthorized ? 'PASSKEY_YUBIKEY_FIDO2_ACTIVE' : '\\x9fa2e01b3cd982f0...';
                    const email2 = decryptAuthorized ? 'advisor@cosmaeon.in' : '\\x5a93d8b27fe109c3a9d28...';
                    const token2 = decryptAuthorized ? 'GOOGLE_MFA_AUTH_SEED_0391' : '\\x12b8d003e89f2910...';

                    htmlTable = `
<table style="width: 100%; border-collapse: collapse; text-align: left; color: var(--text-secondary);">
    <thead>
        <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-accent);">
            <th style="padding: 0.5rem;">id</th>
            <th style="padding: 0.5rem;">email (encrypted)</th>
            <th style="padding: 0.5rem;">role</th>
            <th style="padding: 0.5rem;">mfa_secret (encrypted)</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 0.5rem; color: var(--text-muted);">Birla_ID</td>
            <td style="padding: 0.5rem;">${email1}</td>
            <td style="padding: 0.5rem;">family_member</td>
            <td style="padding: 0.5rem;">${token1}</td>
        </tr>
        <tr>
            <td style="padding: 0.5rem; color: var(--text-muted);">CIO_Partner_ID</td>
            <td style="padding: 0.5rem;">${email2}</td>
            <td style="padding: 0.5rem;">family_office_admin</td>
            <td style="padding: 0.5rem;">${token2}</td>
        </tr>
    </tbody>
</table>
                    `;
                } else if (query.toLowerCase().includes('assets')) {
                    // Render Assets Table
                    htmlTable = `
<table style="width: 100%; border-collapse: collapse; text-align: left; color: var(--text-secondary);">
    <thead>
        <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-accent);">
            <th style="padding: 0.5rem;">id</th>
            <th style="padding: 0.5rem;">name</th>
            <th style="padding: 0.5rem;">asset_class</th>
            <th style="padding: 0.5rem;">expense_ratio</th>
            <th style="padding: 0.5rem;">is_direct_plan</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 0.5rem; color: var(--text-muted);">Asset_1</td>
            <td style="padding: 0.5rem;">SBI Bluechip Regular Fund</td>
            <td style="padding: 0.5rem;">equity</td>
            <td style="padding: 0.5rem; color: var(--color-danger);">1.24%</td>
            <td style="padding: 0.5rem; color: var(--color-danger);">FALSE (Kickback active)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 0.5rem; color: var(--text-muted);">Asset_2</td>
            <td style="padding: 0.5rem;">ICICI Prudential Debt Fund</td>
            <td style="padding: 0.5rem;">fixed_income</td>
            <td style="padding: 0.5rem; color: var(--color-danger);">0.85%</td>
            <td style="padding: 0.5rem; color: var(--color-danger);">FALSE (Kickback active)</td>
        </tr>
        <tr>
            <td style="padding: 0.5rem; color: var(--text-muted);">Asset_3</td>
            <td style="padding: 0.5rem;">Cosmaeon Direct Index Vault</td>
            <td style="padding: 0.5rem;">equity</td>
            <td style="padding: 0.5rem; color: var(--color-success);">0.00%</td>
            <td style="padding: 0.5rem; color: var(--color-success);">TRUE (Direct plan)</td>
        </tr>
    </tbody>
</table>
                    `;
                } else if (query.toLowerCase().includes('audit')) {
                    // Render Audit Logs Table
                    htmlTable = `
<table style="width: 100%; border-collapse: collapse; text-align: left; color: var(--text-secondary);">
    <thead>
        <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-accent);">
            <th style="padding: 0.5rem;">id</th>
            <th style="padding: 0.5rem;">action</th>
            <th style="padding: 0.5rem;">affected_table</th>
            <th style="padding: 0.5rem;">ip_address</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 0.5rem; color: var(--text-muted);">Log_1</td>
            <td style="padding: 0.5rem;">StressTestSimulate</td>
            <td style="padding: 0.5rem;">portfolios</td>
            <td style="padding: 0.5rem;">103.220.44.11</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 0.5rem; color: var(--text-muted);">Log_2</td>
            <td style="padding: 0.5rem;">DecryptColumn("email")</td>
            <td style="padding: 0.5rem;">users</td>
            <td style="padding: 0.5rem;">122.161.80.20</td>
        </tr>
    </tbody>
</table>
                    `;
                } else {
                    htmlTable = `<span style="color: var(--color-danger);">[ERROR] Parse Error near "${query}". Only select queries on 'users', 'assets', or 'audit_logs' are simulated.</span>`;
                }
                
                consoleOutput.innerHTML += htmlTable;
            }, 500);
        });

        // Trigger query on load
        btnRunQuery.click();
    }

    // =========================================================================
    // 6. ADMIN PORTAL: WEBAUTHN SIMULATOR & THREAT LOG ENGINE
    // =========================================================================
    const btnAuthSimulate = document.getElementById('btn-auth-simulate');
    const authLoader = document.getElementById('auth-loader');
    const authLockScreen = document.getElementById('auth-lock-screen');
    const btnLockConsole = document.getElementById('btn-lock-console');

    if (btnAuthSimulate && authLoader && authLockScreen) {
        // Simulate WebAuthn/FIDO2 handshake loading
        btnAuthSimulate.addEventListener('click', () => {
            btnAuthSimulate.style.display = 'none';
            authLoader.style.display = 'block';

            setTimeout(() => {
                authLockScreen.style.opacity = '0';
                setTimeout(() => {
                    authLockScreen.style.display = 'none';
                    // Start threats generator loop
                    startThreatLogger();
                }, 400);
            }, 1200);
        });
    }

    if (btnLockConsole && authLockScreen && btnAuthSimulate && authLoader) {
        btnLockConsole.addEventListener('click', (e) => {
            e.preventDefault();
            authLockScreen.style.display = 'flex';
            setTimeout(() => {
                authLockScreen.style.opacity = '1';
                btnAuthSimulate.style.display = 'block';
                authLoader.style.display = 'none';
            }, 50);
        });
    }

    // Threat Log Simulation Engine
    const startThreatLogger = () => {
        const terminal = document.getElementById('threat-terminal');
        const wafSwitch = document.getElementById('waf-switch');
        const cspSwitch = document.getElementById('csp-switch');
        const geoSwitch = document.getElementById('geo-switch');

        const attackips = ['185.120.44.8', '42.92.15.201', '109.14.80.3', '98.51.100.12', '172.56.8.99'];
        const queryPayloads = ["' OR 1=1 --", "<script>alert(1)</script>", "UNION SELECT username, password FROM users", "DROP TABLE portfolios;", "../../../etc/passwd"];

        const getTimestamp = () => {
            const now = new Date();
            return now.toISOString().replace('T', ' ').substring(0, 19);
        };

        const generateLog = () => {
            if (!terminal) return;

            const ip = attackips[Math.floor(Math.random() * attackips.length)];
            const isWafActive = wafSwitch ? wafSwitch.checked : true;
            const isCspActive = cspSwitch ? cspSwitch.checked : true;
            const isGeoActive = geoSwitch ? geoSwitch.checked : false;

            const logEl = document.createElement('div');
            logEl.className = 'log-entry';

            // Determine threat event
            const roll = Math.random();
            if (roll < 0.3) {
                // SQLi Attempt
                const payload = queryPayloads[Math.floor(Math.random() * queryPayloads.length)];
                if (isWafActive) {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-blocked">[BLOCKED]</span> ${ip} - SQLi query payload intercepted on /api/portfolios (Param: query="${payload}")`;
                } else {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-warn">[WARN]</span> ${ip} - Unfiltered input pattern executed on /api/portfolios (Param: query="${payload}")`;
                }
            } else if (roll < 0.6) {
                // XSS Injection
                if (isCspActive) {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-blocked">[BLOCKED]</span> ${ip} - Inline script execution blocked by strict CSP rules on client browser.`;
                } else {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-warn">[SECURITY CRITICAL]</span> ${ip} - Injected script executed inside client session node.`;
                }
            } else if (roll < 0.8) {
                // Geo Location Check
                if (isGeoActive) {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-blocked">[BLOCKED]</span> ${ip} - Geo-IP fencing block active. Connection terminated.`;
                } else {
                    logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-info">[INFO]</span> ${ip} - Remote connection established (Location: Outsourced Node).`;
                }
            } else {
                // General Info log
                logEl.innerHTML = `<span style="color: var(--text-muted);">${getTimestamp()}</span> <span class="log-info">[INFO]</span> Fiduciary node telemetry sync complete. 0 errors.`;
            }

            terminal.appendChild(logEl);
            terminal.scrollTop = terminal.scrollHeight;
        };

        // Trigger logs every 3 seconds
        setInterval(generateLog, 3000);
    };

    // =========================================================================
    // 7. CLIENT PORTAL: AI PORTFOLIO COPILOT PANEL
    // =========================================================================
    const btnSubmitQuery = document.getElementById('btn-submit-query');
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiChatWindow = document.getElementById('ai-chat-window');

    if (btnSubmitQuery && aiQueryInput && aiChatWindow) {
        const addMessage = (role, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ${role}`;
            
            const sender = role === 'user' ? 'You' : 'COSMAEON Intelligence';
            
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
            aiChatWindow.appendChild(messageDiv);
            
            // Auto scroll to bottom
            aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
        };

        btnSubmitQuery.addEventListener('click', () => {
            const query = aiQueryInput.value.trim();
            if (!query) return;

            // Add user message
            addMessage('user', query);
            aiQueryInput.value = '';

            // Simulate AI Diagnostic Reasoning delay
            setTimeout(() => {
                let responseText = '';
                if (query.toLowerCase().includes('overlap') || query.toLowerCase().includes('correlation')) {
                    responseText = 'Diagnostic reasoning indicates a **22.4% portfolio overlap** between *ICICI Prudential Bluechip Fund* and *SBI Bluechip Fund* (both hold overlapping positions in Reliance, ICICI Bank, and Infosys). Resolving this reduces correlation risk. See [Sector_Concentration_Report.pdf](#) for details.';
                } else if (query.toLowerCase().includes('stress') || query.toLowerCase().includes('regime')) {
                    responseText = 'Regime modeling stress-tests indicate that a high-inflation scenario degrades real fixed-income yields by **3.2%**. We recommend increasing asset allocations in inflation-hedged instruments like physical commodity vaults. See research note [Macro_Regime_Analysis.pdf](#).';
                } else {
                    responseText = 'I have analyzed your portfolio values against current SEBI direct-plan definitions. Under current conditions, allocating into direct-plan funds has saved this portfolio approximately **₹2.25 Crores** in trailing broker commissions. Risk levels remain nominal.';
                }
                addMessage('system', responseText);
            }, 800);
        });

        // Trigger click on Enter key press
        aiQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnSubmitQuery.click();
            }
        });
    }

    // =========================================================================
    // 8. APP LAYOUT: COLLAPSIBLE SIDEBAR CONTROLLER
    // =========================================================================
    const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
    const appSidebar = document.getElementById('app-sidebar');

    if (appSidebar) {
        // Initialize sidebar collapsed state from localStorage
        const isCollapsed = localStorage.getItem('cosmaeon-sidebar-collapsed') === 'true';
        if (isCollapsed) {
            appSidebar.classList.add('collapsed');
        }

        if (btnSidebarToggle) {
            btnSidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                appSidebar.classList.toggle('collapsed');
                const nowCollapsed = appSidebar.classList.contains('collapsed');
                localStorage.setItem('cosmaeon-sidebar-collapsed', nowCollapsed);
            });
        }
    }

    // =========================================================================
    // 9. DYNAMIC TELEMETRY EVENT TRACKER (Analytics / CTO)
    // =========================================================================
    const telemetryFeed = document.getElementById('telemetry-feed');

    const getTimestampHMS = () => {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    };

    const trackTelemetry = (eventName, eventData = {}) => {
        console.log(`[Telemetry: ${eventName}]`, eventData);
        if (!telemetryFeed) return;

        const entry = document.createElement('div');
        entry.className = 'telemetry-entry';
        entry.innerHTML = `
            <span class="telemetry-time">${getTimestampHMS()}</span>
            <span class="telemetry-event">${eventName}</span>
            <span class="telemetry-desc">${JSON.stringify(eventData)}</span>
        `;
        telemetryFeed.insertBefore(entry, telemetryFeed.firstChild);
        
        // Keep logs capped at 20 entries
        while (telemetryFeed.children.length > 20) {
            telemetryFeed.removeChild(telemetryFeed.lastChild);
        }
    };

    // Instrument static controls
    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            trackTelemetry('theme_changed', { theme: themeSelect.value });
        });
    }
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            trackTelemetry('font_changed', { font: fontSelect.value });
        });
    }
    if (btnSidebarToggle) {
        btnSidebarToggle.addEventListener('click', () => {
            const sidebarState = appSidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
            trackTelemetry('sidebar_toggled', { state: sidebarState });
        });
    }
    if (tabB2C && tabB2B) {
        tabB2C.addEventListener('click', () => trackTelemetry('landing_segment_toggled', { segment: 'b2c' }));
        tabB2B.addEventListener('click', () => trackTelemetry('landing_segment_toggled', { segment: 'b2b' }));
    }
    if (btnRecalculateSim) {
        btnRecalculateSim.addEventListener('click', () => {
            trackTelemetry('homepage_simulator_run', {
                aum: simAum.value,
                bank: slideBank.value,
                broker: slideBroker.value,
                agent: slideAgent.value
            });
        });
    }
    if (btnSimulateRegime) {
        btnSimulateRegime.addEventListener('click', () => {
            const regimeSelect = document.getElementById('regime-selector');
            trackTelemetry('stress_test_regime_simulated', { regime: regimeSelect ? regimeSelect.value : 'growth' });
        });
    }
    if (btnSubmitQuery) {
        btnSubmitQuery.addEventListener('click', () => {
            trackTelemetry('copilot_query_submitted', { queryLength: aiQueryInput.value.length });
        });
    }
    if (btnRunQuery) {
        btnRunQuery.addEventListener('click', () => {
            trackTelemetry('db_query_executed', { query: dbQueryInput.value, decrypt: decryptToggle.checked });
        });
    }
    if (decryptToggle) {
        decryptToggle.addEventListener('change', () => {
            trackTelemetry('db_decryption_toggled', { enabled: decryptToggle.checked });
        });
    }

    // =========================================================================
    // 10. SECURE STATEMENT PARSER (CTO / App Consultancies)
    // =========================================================================
    const dropZone = document.getElementById('statement-drop-zone');
    const parserProgress = document.getElementById('parser-progress');
    const parserProgressBar = document.getElementById('parser-progress-bar');
    const documentVaultList = document.getElementById('document-vault-list');

    if (dropZone && parserProgress && parserProgressBar) {
        // Dragover
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            }, false);
        });

        // Dragleave
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            }, false);
        });

        // Drop file handler
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                const file = files[0];
                trackTelemetry('file_dropped', { name: file.name, size: file.size, type: file.type });
                
                // Trigger client-side simulation animation
                parserProgress.style.display = 'block';
                parserProgressBar.style.width = '0%';
                dropZone.querySelector('.file-drop-text').innerText = `Extracting local data...`;
                dropZone.querySelector('.file-drop-subtext').innerText = `${file.name} - Processing client-side only`;

                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(interval);
                        
                        // Parse complete
                        trackTelemetry('statement_parsed', { name: file.name, status: 'success' });
                        dropZone.querySelector('.file-drop-text').innerText = `Intake Succeeded`;
                        dropZone.querySelector('.file-drop-subtext').innerText = `Audit logs and metrics updated.`;
                        
                        setTimeout(() => {
                            parserProgress.style.display = 'none';
                            dropZone.querySelector('.file-drop-text').innerText = `Secure Statement Intake`;
                            dropZone.querySelector('.file-drop-subtext').innerText = `Drag & drop PDF statement to parse locally`;
                        }, 2500);

                        // Visual metric update pulse (representing APP Consultancies premium micro-animations)
                        const statCards = document.querySelectorAll('.stat-card');
                        statCards.forEach(card => {
                            card.classList.add('metric-pulse');
                            setTimeout(() => card.classList.remove('metric-pulse'), 1200);
                        });

                        // Dynamically append new statement to vault
                        if (documentVaultList) {
                            const li = document.createElement('li');
                            const timestampHash = '0x' + Math.random().toString(16).substring(2, 10) + '...';
                            li.innerHTML = `<a href="#" style="color: var(--color-success); font-weight: 500;">↓ secure_parsed_${file.name.replace(/\s+/g, '_')} (${timestampHash})</a>`;
                            documentVaultList.insertBefore(li, documentVaultList.firstChild);
                        }

                        // Add new log entry dynamically to the table
                        const logBody = document.getElementById('compliance-log-body');
                        if (logBody) {
                            const tr = document.createElement('tr');
                            tr.style.borderBottom = '1px solid var(--color-border)';
                            
                            const now = new Date();
                            const timeString = now.toISOString().replace('T', ' ').substring(0, 19);
                            const randomHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
                            
                            tr.innerHTML = `
                                <td style="padding: 0.75rem 0; font-family: monospace;">${timeString}</td>
                                <td style="padding: 0.75rem 0;">V. Birla (Trustee)</td>
                                <td style="padding: 0.75rem 0; font-family: monospace;">103.220.44.11</td>
                                <td style="padding: 0.75rem 0;">Local WASM statement ingestion ("${file.name}")</td>
                                <td style="padding: 0.75rem 0; font-family: monospace;" class="hash-text">${randomHash.substring(0, 16)}...</td>
                                <td style="padding: 0.75rem 0; color: var(--color-success);">[APPROVED]</td>
                            `;
                            logBody.insertBefore(tr, logBody.firstChild);
                        }
                    } else {
                        width += 10;
                        parserProgressBar.style.width = `${width}%`;
                    }
                }, 120);
            }
        });
    }

    // =========================================================================
    // 11. CRYPTOGRAPHIC LEDGER CHAIN VERIFICATION (JPMC / Compliance)
    // =========================================================================
    const btnVerifyLedger = document.getElementById('btn-verify-ledger');
    const logBodyEl = document.getElementById('compliance-log-body');

    if (btnVerifyLedger && logBodyEl) {
        btnVerifyLedger.addEventListener('click', () => {
            trackTelemetry('audit_ledger_integrity_verified', { action: 'initiate_chain_validation' });
            
            btnVerifyLedger.innerText = 'Verifying Blocks...';
            btnVerifyLedger.style.borderColor = 'var(--color-warning)';
            btnVerifyLedger.style.color = 'var(--color-warning)';
            
            const rows = logBodyEl.querySelectorAll('tr');
            let rowIndex = rows.length - 1; // start from oldest log

            const highlightRow = () => {
                if (rowIndex >= 0) {
                    const row = rows[rowIndex];
                    const prevBg = row.style.backgroundColor;
                    row.style.backgroundColor = 'var(--color-accent-dim)';
                    row.style.transition = 'background-color 0.15s ease';
                    
                    setTimeout(() => {
                        row.style.backgroundColor = prevBg || 'transparent';
                        rowIndex--;
                        highlightRow();
                    }, 200);
                } else {
                    // Complete verification successfully
                    btnVerifyLedger.innerText = 'Chain Verified';
                    btnVerifyLedger.style.borderColor = 'var(--color-success)';
                    btnVerifyLedger.style.color = 'var(--color-success)';
                    btnVerifyLedger.style.backgroundColor = 'var(--color-success-dim)';
                    
                    trackTelemetry('audit_ledger_integrity_verified', { status: '100%_hashes_valid' });

                    alert('Fiduciary Cryptographic Ledger Integrity Check: 100% verified. No transaction tampering detected. Root block hash matches.');
                }
            };

            highlightRow();
        });
    }
});
