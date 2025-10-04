import { NavLink, Outlet, useLocation, useSearchParams } from "react-router";
import { useNotes } from "../Context/NoteContext";
import Logo from "../Components/Logo";
import MobileMenu from "../Components/MobileMenu";
import { useSettings } from "../Context/SettingsContext";
import HomeIcon from "../Components/HomeIcon";
import DesktopNavigationLink from "../Components/DesktopNavigationLink";
import ArchiveIcon from "../Components/ArchiveIcon";
import ListOfTags from "../Components/ListOfTags";
import { useSearch } from "../Context/SearchContext";
import { useCallback } from "react";
import { useTag } from "../Context/TagContext";
import Heading from "../Components/Heading";
import HeadingPart from "../Components/HeadingPart";
import SearchInputBox from "../Components/SearchInputBox";
import SettingIcon from "../Components/SettingIcon";

function NotesPageLayout() {
  const { isSmallerScreenSize } = useNotes();
  const location = useLocation();
  const { selectedTags, tagLists } = useTag();
  const { activeColorTheme } = useSettings();
  const { searchInput, onSearchInputChange, actualSearchQueryFromURL } =
    useSearch();
  const [searchParams] = useSearchParams();

  const pathMatch = useCallback(
    function (path) {
      const checkPath = location.pathname.startsWith(path);

      return checkPath;
    },
    [location.pathname]
  );

  const query =
    searchParams.get("query")?.at(0)?.toUpperCase() +
    searchParams.get("query")?.slice(1);

  const tagSearchParams = searchParams
    .getAll("tag") // Get all values for the 'tag' parameter
    .map((tag) => `tag=${encodeURIComponent(tag)}`)
    .join("&"); // Format them as 'tag=value' and join them with &

  const isSearchOrTagsPage = pathMatch("/search") || pathMatch("/tags");
  const isCreateNewNotePage =
    pathMatch("/all-notes/new") || pathMatch("/archived-notes/new");
  const isDetailsNotePage =
    pathMatch("/all-notes/") ||
    pathMatch("/search/") ||
    pathMatch("/archived-notes/") ||
    pathMatch("/tags/");

  let headingTitle = "";

  //writting the name for titles in the desktop view
  if (pathMatch("/all-notes")) {
    headingTitle = "All Notes";
  } else if (pathMatch("/archived-notes")) {
    headingTitle = "Archived Notes";
  } else if (searchParams.get("query")) {
    headingTitle = `${query}`;
  } else if (pathMatch("/tags") && selectedTags.length > 0) {
    headingTitle = `${tagLists}`;
  } else if (pathMatch("/settings")) {
    headingTitle = `Settings`;
  }

  return (
    <div className={`xl:bg-background-primary`}>
      <div className="xl:max-w-[90rem] xl:grid xl:grid-cols-[auto_1fr] xl:mx-auto">
        {/* Header Content */}
        {!isSmallerScreenSize && (
          <header className="xl:px-4 xl:pt-3 border-r border-border-separator">
            <Logo />

            {/*Main Page Navigation */}
            <nav>
              <ul className="flex flex-col space-y-1 border-b border-border-separator pb-2">
                <li>
                  <DesktopNavigationLink
                    title={"All Notes"}
                    path={"/all-notes"}
                  >
                    <HomeIcon width={"w-5"} />
                  </DesktopNavigationLink>
                </li>

                <li>
                  <DesktopNavigationLink
                    title={"Archived Notes"}
                    path={"/archived-notes"}
                  >
                    <ArchiveIcon width={"w-5"} />
                  </DesktopNavigationLink>
                </li>
              </ul>
            </nav>

            {/* Tags */}
            <div>
              <h2 className="p-2 text-sm -tracking-50 text-desktop-tag-title">
                Tags
              </h2>

              <ul className="space-y-1  text-filter-tag-text">
                <ListOfTags />
              </ul>
            </div>
          </header>
        )}
        {/* Main Content */}
        <div className="min-h-screen flex flex-col xl:flex-auto ">
          {isSmallerScreenSize && (
            <header className="bg-logo-background xl:bg-background-primary">
              <div className="container mx-auto ">
                <Logo />
              </div>
            </header>
          )}

          <div className="flex-auto flex flex-col  bg-background-primary">
            <main
              className={`flex-auto flex flex-col overflow-hidden container mx-auto ${
                !isCreateNewNotePage && "rounded-xl"
              }`}
            >
              {!isSmallerScreenSize && (
                <div className="border-b border-border-separator xl:flex xl:justify-between xl:items-center xl:py-[1.156rem] xl:px-8">
                  <Heading
                    level={"h1"}
                    classname={"pt-5 pb-4 px-4 xl:p-0 text-text-primary"}
                  >
                    {!isSearchOrTagsPage ? (
                      headingTitle
                    ) : pathMatch("/search") ? (
                      <HeadingPart
                        title={"Showing results for: "}
                        text={`${headingTitle}`}
                      />
                    ) : (
                      <HeadingPart
                        title={"Notes Tagged: "}
                        text={`${headingTitle}`}
                      />
                    )}
                  </Heading>

                  {/* Setting button and Search box on a desktop */}
                  <div className="flex items-center gap-x-4">
                    <SearchInputBox
                      actualSearchQueryFromURL={actualSearchQueryFromURL}
                      searchInput={searchInput}
                      onSearchInputChange={onSearchInputChange}
                    />

                    <NavLink
                      to={`/settings`}
                      aria-label="Settings"
                      className={" focusable-ring text-desktop-setting-icon"}
                    >
                      <SettingIcon />
                    </NavLink>
                  </div>
                </div>
              )}

              <div
                className={`relative flex-auto  flex flex-col xl:grid xl:grid-cols-[auto_1fr] px-4 ${
                  (isCreateNewNotePage && activeColorTheme === "dark") ||
                  (isDetailsNotePage && activeColorTheme === "dark")
                    ? "md:px-6"
                    : "md:px-8"
                } mb-[3.75rem] md:mb-[4.799rem] xl:mb-0 xl:p-0 bg-background-primary `}
              >
                <Outlet />
              </div>
            </main>
          </div>

          {/* Mobile view Menu Bar */}
          {isSmallerScreenSize && (
            <MobileMenu currentSearchParams={tagSearchParams} />
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPageLayout;
