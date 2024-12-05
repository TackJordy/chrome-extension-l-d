export const useBadge = () => {
  const updateBadgeCount = (count: number, tabId?: number) => {
    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      count,
      tabId
    });
  };

  const clearBadge = (tabId?: number) => {
    updateBadgeCount(0, tabId);
  };

  return {
    updateBadgeCount,
    clearBadge
  };
}; 