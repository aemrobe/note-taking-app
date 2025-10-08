import { Outlet, useNavigate } from "react-router";
import { useNotes } from "../../Context/NoteContext";

import SettingsPage from "../../pages/SettingsPage";
import { useSettings } from "../../Context/SettingsContext";
import { useEffect } from "react";

function SettingsPageLayout() {
  const { isSmallerScreenSize } = useNotes();
  const { currentActiveSetting } = useSettings();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isSmallerScreenSize) {
        navigate(`/settings/${currentActiveSetting}`);
      }
    },
    [currentActiveSetting, isSmallerScreenSize, navigate]
  );

  return (
    <>
      {isSmallerScreenSize ? (
        <Outlet />
      ) : (
        <>
          <SettingsPage />
          <Outlet />
        </>
      )}
    </>
  );
}

export default SettingsPageLayout;
