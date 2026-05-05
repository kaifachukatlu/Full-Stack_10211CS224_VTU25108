// Initialize EmailJS (Keys are stored in .env but used here as placeholders as requested)
if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    
    if (type === 'error') {
        toast.style.borderColor = 'var(--status-rejected)';
        toast.style.boxShadow = '0 0 15px rgba(255, 23, 68, 0.3)';
    }

    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Live Search Autocomplete
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('jobSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const jobCards = document.querySelectorAll('.job-card');
            
            jobCards.forEach(card => {
                const titleElem = card.querySelector('h3');
                // The company div doesn't have a specific class, so we look at the next sibling or just grab all text
                const title = titleElem ? titleElem.innerText.toLowerCase() : '';
                const allText = card.innerText.toLowerCase();
                
                if (title.includes(query) || allText.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Dynamic Table Filtering
    const tableFilter = document.getElementById('tableFilter');
    if (tableFilter) {
        tableFilter.addEventListener('change', (e) => {
            const status = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.table-glass tbody tr');
            
            rows.forEach(row => {
                const rowStatusElem = row.querySelector('.badge');
                if (!rowStatusElem) return;
                
                const rowStatus = rowStatusElem.innerText.toLowerCase();
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// Update Application Status via API
async function updateStatus(applicationId, status) {
    try {
        const response = await fetch('/api/employer/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add CSRF token if enabled, handled via thymeleaf usually
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
            },
            body: JSON.stringify({ applicationId, status })
        });
        
        const result = await response.json();
        if (result.success) {
            showToast('Status updated successfully');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(result.message || 'Error updating status', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

// Apply for Job
async function applyForJob(event, jobId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('jobId', jobId);
    
    // CSRF
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
    
    const headers = {};
    if (csrfToken && csrfHeader) headers[csrfHeader] = csrfToken;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Applying...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/student/apply', {
            method: 'POST',
            headers: headers,
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            // Get job details from DOM for the email
            const modal = document.getElementById('modal-' + jobId);
            const jobTitle = modal ? modal.querySelector('h3 span').innerText : 'the job';
            const companyName = modal ? modal.querySelector('p').innerText : 'our company';

            // Send confirmation email via EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.send(
                    "YOUR_EMAILJS_SERVICE_ID",
                    "YOUR_EMAILJS_TEMPLATE_ID",
                    {
                        to_name: "Candidate",
                        job_title: jobTitle,
                        company_name: companyName,
                        reply_to: "noreply@hirespace.com"
                    }
                ).then(
                    function(response) {
                        console.log('EmailJS SUCCESS!', response.status, response.text);
                        showToast('Application submitted successfully!');
                    },
                    function(error) {
                        console.log('EmailJS FAILED...', error);
                        showToast('Submission failed, please try again.', 'error');
                    }
                );
            } else {
                showToast('Application submitted successfully!');
            }
            
            setTimeout(() => window.location.href = '/student/dashboard', 2000);
        } else {
            showToast(result.message, 'error');
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        showToast('System Error', 'error');
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// JSearch API (Live Job Listings)
async function fetchLiveJobs(query) {
    if (!query) return;

    const grid = document.querySelector('.dashboard-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 16px; color: var(--text-secondary);">Searching live jobs via JSearch...</p>
        </div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;

    try {
        const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API call failed');
        }

        if (result.data && result.data.length > 0) {
            grid.innerHTML = ''; // Clear loading
            
            result.data.forEach(job => {
                const jobType = job.job_is_remote ? 'Remote' : (job.job_city || 'Location N/A');
                const salary = job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : 'Salary not specified';
                const description = job.job_description ? job.job_description.substring(0, 150) + '...' : 'No description provided.';
                
                // Create existing job card layout
                const card = document.createElement('div');
                card.className = 'card job-card';
                card.innerHTML = `
                    <button class="btn-icon" style="position: absolute; top: 16px; right: 16px;" onclick="this.querySelector('svg').classList.toggle('filled'); this.querySelector('svg').style.fill = this.querySelector('svg').classList.contains('filled') ? 'currentColor' : 'none';">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    
                    <div class="job-header">
                        <div class="company-logo">
                            ${job.employer_logo ? `<img src="${job.employer_logo}" alt="logo" style="width:100%; height:100%; object-fit:contain; border-radius:50%;">` : (job.employer_name || 'C').substring(0, 1)}
                        </div>
                        <div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${job.job_title}</h3>
                            <div style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;">${job.employer_name}</div>
                        </div>
                    </div>
                    
                    <div class="job-meta">
                        <span class="badge" style="background: #F1F5F9;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"></circle><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
                            <span>${jobType}</span>
                        </span>
                        <span class="badge blue">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <span>${salary}</span>
                        </span>
                    </div>
                    
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${description}</p>
                    
                    <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">Live JSearch Result</span>
                        <a href="${job.job_apply_link}" target="_blank" class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem; text-decoration:none;">Apply Now</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--bg-surface);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); margin-bottom: 16px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <h3 style="margin-bottom: 8px;">No jobs found</h3>
                    <p style="color: var(--text-secondary);">Try adjusting your search query.</p>
                </div>
            `;
        }
    } catch (error) {
        // Fallback to Mock Data for the college presentation if API fails (e.g. 403 Forbidden)
        grid.innerHTML = ''; // Clear loading
        
        const mockJobs = [
            {
                job_title: "Senior Cloud Architect",
                employer_name: "Tech Solutions Inc.",
                job_is_remote: true,
                job_min_salary: 140000,
                job_max_salary: 180000,
                job_description: "We are looking for a cloud expert to lead our AWS migration. Must have 5+ years of experience with Kubernetes, Docker, and Terraform.",
                job_apply_link: "#"
            },
            {
                job_title: "Frontend Developer (React)",
                employer_name: "Creative Web Studio",
                job_city: "New York, NY",
                job_min_salary: 90000,
                job_max_salary: 120000,
                job_description: "Join our fast-paced agency building interactive web applications using React, TypeScript, and TailwindCSS.",
                job_apply_link: "#"
            },
            {
                job_title: "Data Scientist",
                employer_name: "Global Analytics",
                job_is_remote: false,
                job_city: "San Francisco, CA",
                job_min_salary: 130000,
                job_max_salary: 160000,
                job_description: "Analyze large datasets and build predictive machine learning models to drive business growth.",
                job_apply_link: "#"
            }
        ];

        mockJobs.forEach(job => {
            const jobType = job.job_is_remote ? 'Remote' : (job.job_city || 'Location N/A');
            const salary = job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : 'Salary not specified';
            const description = job.job_description;
            
            const card = document.createElement('div');
            card.className = 'card job-card';
            card.innerHTML = `
                <button class="btn-icon" style="position: absolute; top: 16px; right: 16px;" onclick="this.querySelector('svg').classList.toggle('filled'); this.querySelector('svg').style.fill = this.querySelector('svg').classList.contains('filled') ? 'currentColor' : 'none';">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
                
                <div class="job-header">
                    <div class="company-logo">${job.employer_name.substring(0, 1)}</div>
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${job.job_title}</h3>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;">${job.employer_name}</div>
                    </div>
                </div>
                
                <div class="job-meta">
                    <span class="badge" style="background: #F1F5F9;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"></circle><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
                        <span>${jobType}</span>
                    </span>
                    <span class="badge blue">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        <span>${salary}</span>
                    </span>
                </div>
                
                <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; flex-grow: 1;">${description}</p>
                
                <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.85rem; color: var(--status-pending);">Fallback Mock API Result</span>
                    <a href="#" class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem; text-decoration:none;" onclick="showToast('Application simulated successfully!'); return false;">Apply Now</a>
                </div>
            `;
            grid.appendChild(card);
        });
        
        showToast('Using Mock API data due to missing API key', 'success');
    }
}
