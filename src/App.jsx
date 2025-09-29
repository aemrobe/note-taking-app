import {
  Navigate,
  Outlet,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router";
import { Route } from "react-router";
import AllNotes from "./pages/AllNotes";
import ArchivedNotes from "./pages/ArchivedNotes";
import { NotesProvider, useNotes } from "./Context/NoteContext";

import NotesPageLayout from "./Layouts/NotesPageLayout";
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
import AllNotesLayout from "./Layouts/AllNotesLayout";
import ArchivedNotesLayout from "./Layouts/ArchivedNotesLayout";
import SearchPageLayout from "./Layouts/SearchPageLayout";
import { SearchProvider } from "./Context/SearchContext";
import TagPageLayout from "./Layouts/TagPageLayout";
import SettingsPageLayout from "./Layouts/SettingsPageLayout";

function App() {
  const appRef = useRef(null);

  return (
    <Router>
      <div ref={appRef}>
        <ModalProvider appRef={appRef}>
          <FocusProvider>
            <ToastProvider>
              <NotesProvider>
                <SearchProvider>
                  <SettingsProvider>
                    <TagProvider>
                      <Routes>
                        <Route path="/" element={<NotesPageLayout />}>
                          <Route
                            index
                            element={<Navigate replace to="all-notes" />}
                          />
                          <Route path="all-notes" element={<AllNotesLayout />}>
                            <Route index element={<AllNotes />} />
                            <Route
                              path=":noteTitle"
                              element={<DetailOfNotes />}
                            />
                            <Route path="new" element={<CreateNewNotePage />} />
                          </Route>
                          <Route path="search" element={<SearchPageLayout />}>
                            <Route index element={<SearchPage />} />
                            <Route
                              path=":noteTitle"
                              element={<DetailOfNotes />}
                            />
                          </Route>
                          <Route
                            path="archived-notes"
                            element={<ArchivedNotesLayout />}
                          >
                            <Route index element={<ArchivedNotes />} />
                            <Route
                              path=":noteTitle"
                              element={<DetailOfNotes />}
                            />
                            <Route path="new" element={<CreateNewNotePage />} />
                          </Route>
                          <Route path="tags" element={<TagPageLayout />}>
                            <Route index element={<TagsPage />} />
                            <Route
                              path=":noteTitle"
                              element={<DetailOfNotes />}
                            />
                          </Route>
                          <Route
                            path="settings"
                            element={<SettingsPageLayout />}
                          >
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
                </SearchProvider>
              </NotesProvider>
            </ToastProvider>
          </FocusProvider>
        </ModalProvider>
      </div>
    </Router>
  );
}

export default App;
