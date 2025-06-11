import React from 'react';

function LanguageSelector() {
  const changeLanguage = (lang) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      className="p-1 border rounded"
    >
      <option value="fr">🇫🇷 Français</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}

export default LanguageSelector;
