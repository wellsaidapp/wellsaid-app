import { useState } from 'react';

const UseDisclosureToggle = (initialId = null) => {
  const [expandedId, setExpandedId] = useState(initialId);

  const toggleDisclosure = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const closeAll = () => {
    setExpandedId(null);
  };

  const openDisclosure = (id) => {
    setExpandedId(id);
  };

  return {
    expandedId,
    toggleDisclosure,
    closeAll,
    openDisclosure,
    isExpanded: (id) => expandedId === id,
  };
};

export default UseDisclosureToggle;
