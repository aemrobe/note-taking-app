import { Navigate, BrowserRouter as Router, Routes } from "react-router";
import { Route } from "react-router";
import AllNotes from "./pages/AllNotes";
import ArchivedNotes from "./pages/ArchivedNotes";
import { NotesProvider } from "./Context/NoteContext";

import NotesPageLayout from "./Components/NotesPageLayout";
import DetailOfNotes from "./pages/DetailOfNotes";
import TagsPage from "./pages/TagsPage";
import { TagProvider } from "./Context/TagContext";
import { ModalProvider } from "./Context/ModalContext";
import { ToastProvider } from "./Context/ToastContext";
import SearchPage from "./pages/SearchPage";

import SettingsPage from "./pages/SettingsPage";
import { SettingsProvider } from "./Context/SettingsContext";
import SettingsDetailsPage from "./pages/SettingsDetailsPage";
import CreateNewNotePage from "./pages/CreateNewNotePage";
import { useRef } from "react";
import { FocusProvider } from "./Context/FocusContext";

function App() {
  const appRef = useRef(null);

  return (
    <Router>
      <div ref={appRef}>
        <ModalProvider appRef={appRef}>
          <FocusProvider>
            <ToastProvider>
              <NotesProvider>
                <SettingsProvider>
                  <TagProvider>
                    <Routes>
                      <Route path="/" element={<NotesPageLayout />}>
                        <Route
                          index
                          element={<Navigate replace to="all-notes" />}
                        />
                        <Route path="all-notes">
                          <Route index element={<AllNotes />} />
                          <Route
                            path=":noteTitle"
                            element={<DetailOfNotes />}
                          />
                        </Route>
                        <Route path="search">
                          <Route index element={<SearchPage />} />
                          <Route
                            path=":noteTitle"
                            element={<DetailOfNotes />}
                          />
                        </Route>
                        <Route path="archived-notes">
                          <Route index element={<ArchivedNotes />} />
                          <Route
                            path=":noteTitle"
                            element={<DetailOfNotes />}
                          />
                        </Route>
                        <Route path="tags">
                          <Route index element={<TagsPage />} />
                          <Route
                            path=":noteTitle"
                            element={<DetailOfNotes />}
                          />
                        </Route>
                        <Route path="settings">
                          <Route index element={<SettingsPage />} />
                          <Route
                            path=":settingType"
                            element={<SettingsDetailsPage />}
                          />
                        </Route>
                        <Route
                          path="create-new-note"
                          element={<CreateNewNotePage />}
                        />
                      </Route>
                    </Routes>
                  </TagProvider>
                </SettingsProvider>
              </NotesProvider>
            </ToastProvider>
          </FocusProvider>
        </ModalProvider>
      </div>
    </Router>
  );
}

export default App;
