import React from "react";
import { getParentFsPath, urlToFsPath, fsToUrlPath } from "../utils";

export function getRecordPathAndAlt(
  path: string
): [string, string] | [null, null] {
  if (!path) {
    return [null, null];
  }
  const items = path.split(/\+/, 2);
  return [urlToFsPath(items[0]), items[1]];
}

/**
 * Helper to generate URL path for an admin page.
 * @param name - Name of the page (or null for the current one)
 * @param path - Record path
 */
export function pathToAdminPage(name: string, path: string) {
  return `${$LEKTOR_CONFIG.admin_root}/${path}/${name}`;
}

export type RecordProps = { match: { params: { path: string; page: string } } };

/**
 * A React component baseclass that has some basic knowledge about
 * the record it works with.
 */
export default class RecordComponent<P, S> extends React.Component<
  P & RecordProps,
  S
> {
  /**
   * Helper to transition to a specific page
   * @param name - Page name
   * @param path - Record path
   */
  transitionToAdminPage(name: string, path: string) {
    const url = pathToAdminPage(name, path);
    this.props.history.push(url);
  }

  /* this returns the path of the current record.  If the current page does
   * not have a path component then null is returned. */
  getRecordPath() {
    const [path] = getRecordPathAndAlt(this.props.match.params.path);
    return path;
  }

  /* returns the current alt */
  getRecordAlt() {
    const [, alt] = getRecordPathAndAlt(this.props.match.params.path);
    return !alt ? "_primary" : alt;
  }

  /* return the url path for the current record path (or a modified one)
     by preserving or overriding the alt */
  getUrlRecordPathWithAlt(newPath?: string, newAlt?: string) {
    const path = newPath ?? this.getRecordPath();
    const alt = newAlt ?? this.getRecordAlt();
    const urlPath = fsToUrlPath(path);
    return alt === "_primary" ? urlPath : `${urlPath}+${alt}`;
  }

  /* returns the parent path if available */
  getParentRecordPath() {
    return getParentFsPath(this.getRecordPath());
  }
}
