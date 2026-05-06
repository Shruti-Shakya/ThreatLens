const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper
function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0] + 'T00:00:00.000';
}

// ==================== DATA SOURCE FUNCTIONS ====================

// 1. CVE/NVD - National Vulnerability Database
async function fetchCVEData() {
  try {
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0', {
      params: {
        resultsPerPage: 10,
        pubStartDate: getDateDaysAgo(7),
        pubEndDate: new Date().toISOString()
      },
      timeout: 10000
    });
    const vulnerabilities = response.data.vulnerabilities || [];
    return vulnerabilities.slice(0, 5).map((vuln) => {
      const cve = vuln.cve;
      const severity = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'Medium';
      return {
        id: `cve-${cve.id}`,
        title: `🔒 Vulnerability: ${cve.id}`,
        area: "Global",
        severity: severity.charAt(0).toUpperCase() + severity.slice(1),
        date: cve.published?.split('T')[0] || new Date().toISOString().split('T')[0],
        description: cve.descriptions?.[0]?.value?.substring(0, 200) || "Critical vulnerability detected in software systems",
        type: "CVE",
        status: "Active",
        sector: "Technology",
        cveId: cve.id,
        source: "NVD"
      };
    });
  } catch (error) {
    console.error("CVE/NVD fetch error:", error.message);
    return [];
  }
}

// 2. GitHub Security Advisories
async function fetchGitHubSecurityAdvisories() {
  try {
    const response = await axios.get('https://api.github.com/advisories', {
      params: {
        per_page: 5,
        sort: 'published',
        direction: 'desc'
      },
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ThreatLens-App'
      },
      timeout: 10000
    });

    return response.data.map((advisory) => ({
      id: `gh-${advisory.ghsa_id}`,
      title: `🛡️ ${advisory.summary}`,
      area: "Global",
      severity: advisory.severity?.charAt(0).toUpperCase() + advisory.severity?.slice(1) || 'Medium',
      date: advisory.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: advisory.description?.substring(0, 200) || "Security advisory published for software vulnerability",
      type: "Security Advisory",
      status: "Active",
      sector: "Technology",
      ghsaId: advisory.ghsa_id,
      source: "GitHub"
    }));
  } catch (error) {
    console.error("GitHub advisory fetch error:", error.message);
    return [];
  }
}

// 3. AlienVault OTX - Open Threat Exchange
async function fetchAlienVaultOTX() {
  const API_KEY = process.env.OTX_API_KEY;
  if (!API_KEY) return [];
  try {
    const response = await axios.get('https://otx.alienvault.com/api/v1/pulses/subscribed', {
      headers: {
        'X-OTX-API-KEY': API_KEY
      },
      params: { limit: 5, page: 1 },
      timeout: 10000
    });
    return (response.data.results || []).map((pulse) => ({
      id: `otx-${pulse.id}`,
      title: `⚠️ ${pulse.name}`,
      area: pulse.targeted_countries?.[0] || "Global",
      severity: pulse.tags?.includes('critical') ? 'Critical' :
                pulse.tags?.includes('high') ? 'High' : 'Medium',
      date: pulse.created?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: pulse.description?.substring(0, 200) || "Threat intelligence from AlienVault community",
      type: "Threat Intelligence",
      status: "Active",
      sector: pulse.industries?.[0] || "Various",
      source: "AlienVault OTX",
      tags: pulse.tags
    }));
  } catch (error) {
    console.error("AlienVault OTX fetch error:", error.message);
    return [];
  }
}

// 4. AbuseIPDB - Malicious IP Database
async function fetchAbuseIPDB() {
  const API_KEY = process.env.ABUSEIPDB_API_KEY;
  if (!API_KEY) return [];
  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
      headers: { 'Key': API_KEY, 'Accept': 'application/json' },
      params: { confidenceMinimum: 90, limit: 5 },
      timeout: 10000
    });
    return (response.data.data || []).map((ip) => ({
      id: `abuse-${ip.ipAddress}`,
      title: `🚫 Malicious IP Detected: ${ip.ipAddress}`,
      area: ip.countryCode || "Unknown",
      severity: ip.abuseConfidenceScore > 95 ? 'Critical' : 'High',
      date: new Date().toISOString().split('T')[0],
      description: `IP flagged for malicious activity with ${ip.abuseConfidenceScore}% confidence. Reports: ${ip.totalReports}`,
      type: "Malicious IP",
      status: "Active",
      sector: "Network Security",
      source: "AbuseIPDB",
      ipAddress: ip.ipAddress
    }));
  } catch (error) {
    console.error("AbuseIPDB fetch error:", error.message);
    return [];
  }
}

// 5. VirusTotal - Malware Intelligence
async function fetchVirusTotalIntelligence() {
  const API_KEY = process.env.VIRUSTOTAL_API_KEY;
  if (!API_KEY) return [];
  try {
    const response = await axios.get('https://www.virustotal.com/api/v3/intelligence/search', {
      headers: { 'x-apikey': API_KEY },
      params: { query: 'type:file positives:10+ fs:2025-10-01+', limit: 5 },
      timeout: 10000
    });
    return (response.data.data || []).map((file) => ({
      id: `vt-${file.id}`,
      title: `🦠 Malware Detected: ${file.attributes.meaningful_name || file.id}`,
      area: "Global",
      severity: file.attributes.last_analysis_stats?.malicious > 30 ? 'Critical' : 'High',
      date: new Date(file.attributes.creation_date * 1000).toISOString().split('T')[0],
      description: `File flagged as malicious by ${file.attributes.last_analysis_stats?.malicious || 0} security vendors`,
      type: "Malware",
      status: "Active",
      sector: "Cybersecurity",
      source: "VirusTotal",
      fileHash: file.attributes.sha256
    }));
  } catch (error) {
    console.error("VirusTotal fetch error:", error.message);
    return [];
  }
}

// 6. Indian CERT-In (sample/manual - no public API)
async function fetchCERTInAdvisories() {
  return [
    {
      id: "certin-1",
      title: "🇮🇳 CERT-In Alert: Multiple Vulnerabilities in Microsoft Products",
      area: "India",
      severity: "High",
      date: new Date().toISOString().split('T')[0],
      description: "CERT-In has identified multiple vulnerabilities affecting Microsoft products.",
      type: "Advisory",
      status: "Active",
      sector: "Government",
      source: "CERT-In"
    },
    {
      id: "certin-2",
      title: "🇮🇳 Phishing Campaign Targeting Indian Banks",
      area: "India",
      severity: "Critical",
      date: new Date().toISOString().split('T')[0],
      description: "Phishing campaign targeting major Indian banking institutions reported.",
      type: "Phishing",
      status: "Active",
      sector: "Banking",
      source: "CERT-In"
    }
  ];
}

// =============== API ENDPOINTS ===============

app.get("/", (req, res) => {
  res.send("🛡️ ThreatLens Backend - Real-time Cyber Threat Intelligence");
});

app.get("/incidents", async (req, res) => {
  try {
    const [
      cveData, githubData, otxData, abuseIPData, virusTotalData, certInData
    ] = await Promise.allSettled([
      fetchCVEData(),
      fetchGitHubSecurityAdvisories(),
      fetchAlienVaultOTX(),
      fetchAbuseIPDB(),
      fetchVirusTotalIntelligence(),
      fetchCERTInAdvisories()
    ]);
    let incidents = [
      // Manual high-profile demo incident
      {
        id: "manual-1",
        title: "🚨 Critical Ransomware Attack on Pune Manufacturing Firm",
        area: "Pune",
        severity: "Critical",
        date: new Date().toISOString().split('T')[0],
        description: "Large-scale ransomware attack targeting manufacturing infrastructure with data encryption demands",
        type: "Ransomware",
        status: "Active",
        sector: "Manufacturing",
        source: "Manual Alert"
      }
    ];

    if (cveData.status === 'fulfilled') incidents.push(...cveData.value);
    if (githubData.status === 'fulfilled') incidents.push(...githubData.value);
    if (otxData.status === 'fulfilled') incidents.push(...otxData.value);
    if (abuseIPData.status === 'fulfilled') incidents.push(...abuseIPData.value);
    if (virusTotalData.status === 'fulfilled') incidents.push(...virusTotalData.value);
    if (certInData.status === 'fulfilled') incidents.push(...certInData.value);

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/incidents`);
    const incidents = response.data;
    const stats = {
      activeToday: incidents.filter(i => i.date === new Date().toISOString().split('T')[0]).length,
      totalWeek: incidents.length,
      blockedThreats: Math.floor(Math.random() * 500) + 1000,
      vulnerabilities: incidents.filter(i => i.type === 'Vulnerability' || i.type === 'CVE').length
    };
    res.json(stats);
  } catch (error) {
    res.json({ activeToday: 12, totalWeek: 89, blockedThreats: 1247, vulnerabilities: 34 });
  }
});

// =============== SERVER ===============
app.listen(PORT, () => {
  console.log(`🛡️  ThreatLens Backend is running on http://localhost:${PORT}`);
});
