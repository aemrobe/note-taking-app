import { Outlet, useLocation, useSearchParams } from "react-router";
import { useNotes } from "../Context/NoteContext";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useSettings } from "../Context/SettingsContext";

function NotesPageLayout() {
  const { isSmallerScreenSize } = useNotes();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { activeColorTheme, activeFontTheme } = useSettings();

  return (
    <div
      // data-theme={activeColorTheme}
      // data-font={activeFontTheme}
      className={`${activeColorTheme} bg-background-primary`}
    >
      {/* Side Bar Content */}
      {!isSmallerScreenSize && (
        <aside>
          <Logo />

          {/* Page Navigation */}
          <nav>
            <ul>
              <li>
                <a href="#allnotes">All Notes</a>
              </li>

              <li>
                <a href="#archivedNotes">Archived Notes</a>
              </li>
            </ul>
          </nav>

          {/* Tags */}
          <div>
            <h2>Tags</h2>

            <ul>
              <li>
                <a href="#cooking">Cooking</a>
              </li>
              <li>
                <a href="#cooking">Dev</a>
              </li>
              <li>
                <a href="#cooking">Fitness</a>
              </li>
              <li>
                <a href="#cooking">Health</a>
              </li>
              <li>
                <a href="#cooking">Personal</a>
              </li>
              <li>
                <a href="#cooking">React</a>
              </li>
              <li>
                <a href="#cooking">Recipes</a>
              </li>
              <li>
                <a href="#cooking">Shopping</a>
              </li>
              <li>
                <a href="#cooking">Travel</a>
              </li>
              <li>
                <a href="#cooking">TypeScript</a>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col">
        <header>
          <Logo />
        </header>

        <main className="flex-auto flex flex-col">
          {!isSmallerScreenSize && (
            <div>
              <h1 className="text-2xl pt-5 pb-4 px-4 font-bold">
                {location.pathname.includes("/allnotes")
                  ? "All Notes"
                  : "Archived Notes"}
              </h1>
              {/* Setting button and Search box on a desktop */}
              <div>
                <input
                  type="search"
                  placeholder="Search by title,content,or tags..."
                />
                <button>
                  <img src="/images/icon-settings.svg" alt="" />
                </button>
              </div>
            </div>
          )}

          <div className="flex-auto flex flex-col px-4 mb-[3.75rem]">
            <Outlet />
          </div>
        </main>

        {/* Mobile view Menu Bar */}
        {isSmallerScreenSize && (
          <MobileMenu currentSearchParams={searchParams.toString()} />
        )}
      </div>
    </div>
  );
}

export default NotesPageLayout;
