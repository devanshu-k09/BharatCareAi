const TopicService = {
  activeTag: null,
  searchQuery: '',

  async fetchTopics(query = '', tag = '') {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (tag) params.append('tag', tag);

      const res = await fetch(`/api/topics?${params.toString()}`, { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      return [];
    }
  },

  async fetchTopicById(id) {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`/api/topics/${id}`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error(`Failed to fetch topic ${id}:`, err);
      return null;
    }
  },

  async toggleBookmark(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to bookmark topics.');
      return false;
    }

    try {
      const res = await fetch(`/api/topics/${id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return false;
      const data = await res.json();

      // Refresh activity timeline if available
      if (typeof ActivityService !== 'undefined' && document.getElementById('activity-timeline-container')) {
        ActivityService.renderTimeline('activity-timeline-container');
      }

      return data.isBookmarked;
    } catch (err) {
      console.error(`Failed to toggle bookmark for ${id}:`, err);
      return false;
    }
  },

  async renderTopicsSection(gridContainerId, tagsContainerId) {
    const gridContainer = document.getElementById(gridContainerId);
    const tagsContainer = document.getElementById(tagsContainerId);

    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="card card-body d-flex align-center gap-md animate-pulse">
          <div class="skeleton-circle" style="width: 40px; height: 40px;"></div>
          <div style="flex-grow: 1;">
            <div class="skeleton-line long" style="height: 16px; margin-bottom: 8px;"></div>
            <div class="skeleton-line short" style="height: 12px;"></div>
          </div>
        </div>
        <div class="card card-body d-flex align-center gap-md animate-pulse">
          <div class="skeleton-circle" style="width: 40px; height: 40px;"></div>
          <div style="flex-grow: 1;">
            <div class="skeleton-line long" style="height: 16px; margin-bottom: 8px;"></div>
            <div class="skeleton-line short" style="height: 12px;"></div>
          </div>
        </div>
      `;
    }

    const topics = await this.fetchTopics(this.searchQuery, this.activeTag);

    // Render Tag Pills
    if (tagsContainer) {
      const allTags = ['#CyberLaw', '#TenantRights', '#StartupIndia', '#GSTCompliance', '#BNS', '#ConsumerRights'];
      tagsContainer.innerHTML = allTags.map(tag => {
        const clean = tag.replace(/^#/, '');
        const isActive = this.activeTag === clean;
        return `
          <span class="badge topic-tag-pill ${isActive ? 'active-tag' : ''}" 
                data-tag="${clean}"
                style="cursor: pointer; padding: 6px 12px; font-size: 0.8rem; border-radius: 16px; transition: all 0.2s ease; ${isActive ? 'background: var(--primary); color: white; font-weight: 600;' : 'background: var(--surface-high); color: var(--text-secondary);'}">
            ${tag} ${isActive ? '✕' : ''}
          </span>
        `;
      }).join('');

      // Add click listeners to tags
      tagsContainer.querySelectorAll('.topic-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const selectedTag = pill.getAttribute('data-tag');
          if (this.activeTag === selectedTag) {
            this.activeTag = null;
          } else {
            this.activeTag = selectedTag;
          }
          this.renderTopicsSection(gridContainerId, tagsContainerId);
        });
      });
    }

    // Render Grid Cards
    if (gridContainer) {
      if (!topics || topics.length === 0) {
        gridContainer.innerHTML = `
          <div class="card card-body col-span-2 text-center p-xl text-muted">
            <span class="material-symbols-outlined d-block mb-sm" style="font-size: 48px; opacity: 0.4;">search_off</span>
            <p class="m-0" style="font-size: 1rem; font-weight: 500;">No topics found matching your query.</p>
            ${this.activeTag || this.searchQuery ? `<button class="btn btn-secondary mt-sm" onclick="TopicService.clearFilters('${gridContainerId}', '${tagsContainerId}')">Clear Filters</button>` : ''}
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = topics.slice(0, 4).map(t => `
        <div class="card card-body d-flex gap-md align-center hover-lift topic-card" 
             style="cursor: pointer; position: relative;" 
             onclick="TopicService.openTopicModal('${t._id}')">
          <div class="p-sm rounded-lg flex-shrink-0" style="background: rgba(0, 81, 213, 0.1);">
            <span class="material-symbols-outlined text-secondary" style="font-size: 24px;">${t.icon || 'article'}</span>
          </div>
          <div class="flex-grow" style="overflow: hidden;">
            <div class="d-flex justify-between align-center">
              <h4 class="m-0 text-truncate" style="font-size: 0.95rem; font-weight: 600;">${t.title}</h4>
              <button class="btn-icon bookmark-btn" 
                      style="padding: 4px; margin-left: 4px; color: ${t.isBookmarked ? 'var(--accent)' : 'var(--text-muted)'};"
                      title="${t.isBookmarked ? 'Bookmarked' : 'Bookmark topic'}"
                      onclick="event.stopPropagation(); TopicService.handleBookmarkClick('${t._id}', this)">
                <span class="material-symbols-outlined" style="font-size: 20px;">${t.isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
              </button>
            </div>
            <p class="m-0 text-muted text-truncate" style="font-size: 0.75rem; margin-top: 2px;">${t.description}</p>
            <div class="d-flex align-center gap-md mt-xs" style="font-size: 0.7rem; color: var(--text-muted);">
              <span><span class="material-symbols-outlined" style="font-size: 12px; vertical-align: middle;">visibility</span> ${t.views || 0} views</span>
              <span>•</span>
              <span class="text-secondary font-semibold">Read More →</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  clearFilters(gridContainerId, tagsContainerId) {
    this.activeTag = null;
    this.searchQuery = '';
    const searchInput = document.getElementById('topic-search-input');
    if (searchInput) searchInput.value = '';
    this.renderTopicsSection(gridContainerId, tagsContainerId);
  },

  async handleBookmarkClick(topicId, btnEl) {
    const isBookmarked = await this.toggleBookmark(topicId);
    const iconSpan = btnEl.querySelector('.material-symbols-outlined');
    if (iconSpan) {
      iconSpan.textContent = isBookmarked ? 'bookmark' : 'bookmark_border';
      btnEl.style.color = isBookmarked ? 'var(--accent)' : 'var(--text-muted)';
      btnEl.title = isBookmarked ? 'Bookmarked' : 'Bookmark topic';
    }
  },

  async openTopicModal(topicId) {
    const topic = await this.fetchTopicById(topicId);
    if (!topic) return;

    let modal = document.getElementById('topic-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'topic-detail-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const content = topic.content || {};
    const laws = content.laws || [];
    const rights = content.rights || [];
    const faqs = content.faqs || [];
    const officialLinks = content.officialLinks || [];

    modal.innerHTML = `
      <div class="modal-dialog animate-scale-up" style="max-width: 720px; width: 90%; background: var(--surface); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-2xl);">
        <div class="modal-header d-flex justify-between align-center p-md" style="border-bottom: 1px solid var(--border); background: var(--surface-low);">
          <div class="d-flex align-center gap-sm">
            <div class="p-xs rounded-lg bg-primary-light text-white d-flex align-center justify-center" style="width: 36px; height: 36px;">
              <span class="material-symbols-outlined">${topic.icon || 'article'}</span>
            </div>
            <div>
              <h3 class="m-0" style="font-size: 1.1rem; color: var(--text-primary);">${topic.title}</h3>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${topic.category || 'General'} • ${topic.views || 0} Views</span>
            </div>
          </div>
          <button class="btn-icon" onclick="TopicService.closeModal()"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div class="modal-body p-lg" style="max-height: 70vh; overflow-y: auto;">
          <!-- Description & Explanation -->
          <div class="mb-md">
            <h4 class="text-primary mb-xs" style="font-size: 0.95rem;">Overview</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${content.explanation || topic.description}</p>
          </div>

          <!-- Citizen Rights -->
          ${rights.length > 0 ? `
            <div class="mb-md p-md rounded-lg" style="background: rgba(0, 81, 213, 0.05); border-left: 4px solid var(--secondary);">
              <h4 class="text-secondary mb-xs d-flex align-center gap-xs" style="font-size: 0.95rem;">
                <span class="material-symbols-outlined" style="font-size: 18px;">gavel</span> Your Legal Rights
              </h4>
              <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.875rem; color: var(--text-primary);">
                ${rights.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Relevant Laws -->
          ${laws.length > 0 ? `
            <div class="mb-md">
              <h4 class="text-primary mb-xs" style="font-size: 0.95rem;">Applicable Indian Laws & Sections</h4>
              <div class="d-flex flex-wrap gap-xs">
                ${laws.map(l => `<span class="badge" style="background: var(--surface-high); color: var(--text-secondary); font-size: 0.8rem;">📜 ${l}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- FAQs -->
          ${faqs.length > 0 ? `
            <div class="mb-md">
              <h4 class="text-primary mb-xs" style="font-size: 0.95rem;">Frequently Asked Questions</h4>
              ${faqs.map(faq => `
                <div class="p-sm rounded-md mb-xs" style="background: var(--surface-low);">
                  <strong style="font-size: 0.85rem; display: block; color: var(--text-primary);">Q: ${faq.q}</strong>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">A: ${faq.a}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Official Links -->
          ${officialLinks.length > 0 ? `
            <div class="mb-md">
              <h4 class="text-primary mb-xs" style="font-size: 0.95rem;">Official Portals & Resources</h4>
              <div class="d-flex flex-column gap-xs">
                ${officialLinks.map(link => `
                  <a href="${link.url}" target="_blank" class="d-flex align-center justify-between p-xs rounded-md" style="background: var(--surface-low); text-decoration: none; color: var(--secondary); font-size: 0.85rem;">
                    <span>🔗 ${link.title}</span>
                    <span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="modal-footer p-md d-flex justify-between align-center flex-wrap gap-sm" style="border-top: 1px solid var(--border); background: var(--surface-low);">
          <div class="d-flex gap-xs">
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="TopicService.downloadPDF('${topic._id}')">
              <span class="material-symbols-outlined" style="font-size: 16px;">picture_as_pdf</span> PDF Report
            </button>
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="TopicService.shareTopic('${topic._id}', '${topic.title}')">
              <span class="material-symbols-outlined" style="font-size: 16px;">share</span> Share
            </button>
          </div>
          <button class="btn btn-primary" style="font-size: 0.85rem;" onclick="TopicService.askAIAboutTopic('${topic._id}', '${topic.title}')">
            <span class="material-symbols-outlined" style="font-size: 18px;">smart_toy</span> Ask AI About This Topic
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.zIndex = '1000';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
  },

  closeModal() {
    const modal = document.getElementById('topic-detail-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  async downloadPDF(topicId) {
    const topic = await this.fetchTopicById(topicId);
    if (!topic) return;

    if (typeof ActivityService !== 'undefined') {
      ActivityService.logActivity({
        title: 'PDF Downloaded',
        description: `Exported summary PDF for '${topic.title}'.`,
        icon: 'picture_as_pdf',
        type: 'complaint'
      });
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${topic.title} - BharatCare AI Legal Summary</title>
          <style>
            body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #00236f; }
            .badge { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>BharatCare AI Legal Summary</h1>
          <h2>${topic.title}</h2>
          <p><strong>Category:</strong> ${topic.category || 'General'}</p>
          <hr />
          <div class="section">
            <h3>Overview</h3>
            <p>${topic.content?.explanation || topic.description}</p>
          </div>
          ${topic.content?.rights ? `
            <div class="section">
              <h3>Your Rights</h3>
              <ul>${topic.content.rights.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${topic.content?.laws ? `
            <div class="section">
              <h3>Applicable Laws</h3>
              <p>${topic.content.laws.join(', ')}</p>
            </div>
          ` : ''}
          <p><em>Generated by BharatCare AI Citizen Help Platform</em></p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  },

  shareTopic(topicId, title) {
    const url = window.location.origin + `/dashboard.html?topicId=${topicId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert(`Link copied to clipboard for '${title}'!`);
    } else {
      alert(`Topic Link: ${url}`);
    }

    if (typeof ActivityService !== 'undefined') {
      ActivityService.logActivity({
        title: 'Topic Shared',
        description: `Shared link for '${title}'.`,
        icon: 'share',
        type: 'navigation'
      });
    }
  },

  askAIAboutTopic(topicId, title) {
    if (typeof ActivityService !== 'undefined') {
      ActivityService.logActivity({
        title: 'AI Query from Topic',
        description: `Asked AI Assistant about '${title}'.`,
        icon: 'smart_toy',
        type: 'ai'
      });
    }
    const prompt = encodeURIComponent(`Please explain my rights and step-by-step guidance regarding: ${title}`);
    window.location.href = `ai-chat.html?prompt=${prompt}`;
  }
};
