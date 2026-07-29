const ActivityService = {
  async logActivity(data) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  },

  async fetchActivities() {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
      const res = await fetch('/api/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      return [];
    }
  },

  async clearActivities() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch('/api/activity', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to clear activities:', err);
      return false;
    }
  },

  getRelativeTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (isNaN(date.getTime())) return 'Recently';

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 172800) return 'Yesterday';

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  },

  getExactTime(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
  },

  getIconColor(icon, type) {
    switch (type) {
      case 'auth': return 'var(--success)';
      case 'complaint': return 'var(--primary)';
      case 'ai': return 'var(--secondary)';
      case 'settings': return 'var(--accent)';
      case 'error': return 'var(--error)';
      default: return 'var(--primary)';
    }
  },

  async renderTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading skeleton
    container.innerHTML = `
      <div class="relative mb-lg animate-pulse">
        <div class="absolute" style="left: -24px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--border);"></div>
        <div style="height: 16px; width: 60%; background: var(--border); border-radius: 4px; margin-bottom: 8px;"></div>
        <div style="height: 12px; width: 80%; background: var(--border); border-radius: 4px;"></div>
      </div>
      <div class="relative mb-lg animate-pulse">
        <div class="absolute" style="left: -24px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--border);"></div>
        <div style="height: 16px; width: 50%; background: var(--border); border-radius: 4px; margin-bottom: 8px;"></div>
        <div style="height: 12px; width: 75%; background: var(--border); border-radius: 4px;"></div>
      </div>
    `;

    const activities = await this.fetchActivities();

    if (!activities || activities.length === 0) {
      container.innerHTML = `
        <div class="text-center p-md text-muted" style="font-size: 0.875rem;">
          <span class="material-symbols-outlined d-block mb-xs" style="font-size: 2rem; color: var(--border-focus);">history</span>
          No recent activity found.
        </div>
      `;
      return;
    }

    container.innerHTML = activities.map(act => {
      const relativeTime = this.getRelativeTime(act.timestamp);
      const exactTime = this.getExactTime(act.timestamp);
      const iconColor = this.getIconColor(act.icon, act.type);

      return `
        <div class="relative mb-lg animate-fade-in" title="${exactTime}">
          <div class="absolute" style="left: -24px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: ${iconColor}; border: 3px solid white; box-shadow: var(--shadow-sm);"></div>
          <div class="d-flex align-center gap-xs">
            <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--text-secondary);">${act.icon || 'circle'}</span>
            <h4 class="m-0" style="font-size: 1rem;">${act.title}</h4>
          </div>
          <p class="text-muted m-0" style="font-size: 0.875rem; margin-top: 2px;">${act.description}</p>
          <span style="font-size: 0.75rem; color: var(--text-muted); cursor: help;" title="${exactTime}">${relativeTime}</span>
        </div>
      `;
    }).join('');
  }
};
