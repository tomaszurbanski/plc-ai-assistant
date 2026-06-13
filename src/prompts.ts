export const SYSTEM_PROMPT_BASE = `You are a senior PLC automation engineer and technical writer specializing in Siemens TIA Portal, SCL, LAD/FBD, PROFINET, HMI (WinCC, TP, KTP), industrial machine diagnostics, maintenance engineering, and retrofit projects.

You have deep practical experience with:
- Siemens S7-1200, S7-1500, S7-300/400 PLCs
- SCL (Structured Control Language), LAD, FBD, STL
- Function Blocks (FB), Functions (FC), Data Blocks (DB), UDTs
- Alarm management, fault handling, interlock logic
- Sensor diagnostics, actuator timeouts, safety signals
- Machine sequencing (step sequences, state machines)
- Drive systems (SINAMICS, SEW, Danfoss)
- FAT/SAT testing procedures
- Maintenance documentation for industrial technicians
- Retrofit of legacy machines

When analyzing PLC code, focus on:
1. PRACTICAL VALUE: What does this code actually do on the machine?
2. DIAGNOSTICS: What can go wrong and how to detect it?
3. MAINTENANCE: What does a maintenance technician need to know?
4. SAFETY: Are there missing interlocks, timeouts, or safety checks?
5. QUALITY: Missing comments, bad naming, missing diagnostics, missing resets.

Always structure your output clearly with headings, bullet points, and tables where appropriate.
Do NOT explain obvious programming concepts. Focus on industrial engineering knowledge.`;

export const PROMPTS = {
  analyzeBlock: (code: string, language: string) => `
Analyze this PLC block and provide a structured technical report.

Language for output: ${language}

PLC CODE:
\`\`\`
${code}
\`\`\`

Provide:
## 1. Block Description
What this block does in plain language for a maintenance technician.

## 2. Inputs / Outputs
Table with: Name | Type | Description | Notes

## 3. Key Logic
Main sequences, conditions, timer logic, interlocks detected.

## 4. Alarm Handling
Alarms, faults, and error conditions found in the code.

## 5. Potential Issues
Specific problems detected:
- Missing timeouts
- Missing diagnostics
- Missing alarm resets
- Incomplete interlocks
- Bad naming
- Missing comments
- Missing manual mode
- Other issues

## 6. Recommendations
Concrete improvements recommended for this block.
`,

  generateDocumentation: (code: string, language: string) => `
Generate maintenance documentation for this PLC code section.

Language for output: ${language}

PLC CODE / PROJECT SECTION:
\`\`\`
${code}
\`\`\`

Generate a complete maintenance document:

## Machine Section Description
Purpose and function of this machine section.

## Startup Conditions
Required conditions before the sequence can start.

## Operating Sequence
Step-by-step description of the automatic cycle.

## Stop Conditions
Normal and fault-triggered stop conditions.

## Alarm List
| Alarm Name | Description | Possible Cause | Action for Technician |

## Diagnostic Steps
Troubleshooting guide for common faults in this section.

## I/O List
| Tag Name | I/O Type | Description | Notes |

## Notes for Maintenance
Important notes for maintenance staff.
`,

  generateAlarmList: (code: string, language: string) => `
Extract all alarm and fault signals from this PLC code and generate a complete HMI alarm list.

Languages for alarm texts: ${language}

PLC CODE:
\`\`\`
${code}
\`\`\`

For each alarm/fault tag found, generate a table row:

| Tag Name | PL Text | EN Text | DE Text | Category | Possible Cause | Operator Action | Maintenance Action |

Categories: FAULT, WARNING, INFO, SAFETY

Focus on tags containing: Fault, Alarm, Error, Warning, Timeout, SensorFault, DriveFault, SafetyFault, or similar patterns.

Also suggest alarm texts for signals that look like they SHOULD have alarms but don't (e.g., actuators without timeout monitoring).
`,

  findMissingDiagnostics: (code: string, language: string) => `
Perform a diagnostic quality audit of this PLC code.

Language for output: ${language}

PLC CODE:
\`\`\`
${code}
\`\`\`

Check for the following issues and report each one with severity and recommendation:

## Missing Diagnostics Audit

### 1. Actuators Without Timeout
Outputs/actuators that have no timeout monitoring for end-position confirmation.

### 2. Sensors Without Diagnostics
Input signals without wire-break or short-circuit monitoring.

### 3. Missing Alarm Resets
Fault bits that are set but never reset or require acknowledgment.

### 4. Missing Manual Mode
Outputs that can only be controlled in AUTO, with no service/manual override.

### 5. Timer Issues
Timers without clear reset conditions or with hardcoded constants instead of parameters.

### 6. Naming Issues
Tags with unclear names, numeric suffixes, or missing descriptions.

### 7. Missing HMI Information
Conditions that should trigger HMI messages but don't.

### 8. Safety Gaps
Missing interlocks, missing safety checks, outputs active without proper conditions.

For each issue: **Tag/Block Name** | **Problem** | **Severity** (High/Medium/Low) | **Recommended Fix**
`,

  createFatChecklist: (code: string, language: string) => `
Create a FAT/SAT test checklist based on this PLC code.

Language for output: ${language}

PLC CODE / PROJECT:
\`\`\`
${code}
\`\`\`

Generate a structured FAT checklist:

## FAT/SAT Test Checklist

### I/O Verification Tests
| # | Test | Signal | Expected Result | OK/NOK | Notes |

### Sequence Tests (AUTO mode)
| # | Test | Preconditions | Action | Expected Result | OK/NOK | Notes |

### Alarm Tests
| # | Alarm | How to Trigger | Expected Response | Reset Method | OK/NOK | Notes |

### Manual Mode Tests
| # | Test | Signal/Button | Expected Result | OK/NOK | Notes |

### Safety / Interlock Tests
| # | Interlock | Trigger | Expected Machine Response | OK/NOK | Notes |

### HMI Tests
| # | Screen/Element | Action | Expected Behavior | OK/NOK | Notes |

Include signature fields at the end for commissioning engineer and customer.
`,

  explainCode: (code: string, language: string) => `
Explain this PLC code snippet for a maintenance technician.

Language for output: ${language}

SELECTED CODE:
\`\`\`
${code}
\`\`\`

Provide:
1. **What this code does** — in simple language, what happens on the machine
2. **Key signals** — what inputs trigger this logic and what outputs it controls
3. **Conditions** — what conditions must be true for this to execute
4. **Potential issues** — anything suspicious or missing in this snippet
5. **Maintenance note** — what a technician should know about this section
`,

  generateSclBlock: (description: string, language: string) => `
Generate a complete, production-ready SCL Function Block for Siemens TIA Portal based on this description.

Language for comments: ${language}
Description: ${description}

Requirements for the generated block:
- Complete FB with VAR_INPUT, VAR_OUTPUT, VAR_IN_OUT, VAR (static), VAR_TEMP sections
- All variables properly typed and commented
- Timeout monitoring for any actuator movements (use TON timer)
- Alarm/fault output with SET/RESET logic
- Alarm acknowledgment input
- Manual mode support (bManual input, manual override outputs)
- Reset input for clearing faults
- All code commented in ${language}
- Practical, ready to use in a real machine project

After the code, provide:
## Block Description
## Input/Output table
## Integration notes (how to call this FB, what DB to create)
## Commissioning notes
`,
};
