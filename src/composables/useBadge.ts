export const useBadge = () => {
  const updateBadgeCount = (count: number) => {
    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      count
    });
  };

  const clearBadge = () => {
    updateBadgeCount(0);
  };

  return {
    updateBadgeCount,
    clearBadge
  };
}; 