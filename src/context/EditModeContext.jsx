import { createContext, useContext } from "react";

import { useAuth } from "./AuthContext";


// ============================================================
// EDIT MODE
// ============================================================
//
// Edit mode ONLY exists inside the admin editing surface
// (the /admin/edit route). That route wraps its subtree in
// <EditModeProvider>. Every public route renders with NO
// provider, so `useEditMode()` there always reports
// `editing: false` and the shared section components render as
// plain, read-only display.
//
// The provider still requires an authenticated admin — and the
// backend `protect` middleware is the real boundary: every
// content write endpoint rejects an unauthenticated request.
// ============================================================

const EditModeContext = createContext(null);


export const EditModeProvider = ({ children }) => {
    const { admin } = useAuth();

    const canEdit = Boolean(admin);

    const value = {
        canEdit,
        // Inside this provider, editing is simply on for an
        // admin. There is no per-page toggle.
        editing: canEdit,
    };

    return (
        <EditModeContext.Provider value={value}>
            {children}
        </EditModeContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useEditMode = () => {
    return (
        useContext(EditModeContext) || {
            canEdit: false,
            editing: false,
        }
    );
};
