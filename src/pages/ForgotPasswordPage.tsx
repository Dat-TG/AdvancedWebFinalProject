import { Grid } from "@mui/material";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function ForgotPasswordPage() {
  const { t } = useTranslation("global");
  useEffect(() => {
    document.title = t("forgotPassword");
  }, [t]);
  return (
    <div>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={5} sx={{ pt: "100px" }}>
          <ForgotPasswordForm />
        </Grid>
      </Grid>
    </div>
  );
}

export default ForgotPasswordPage;
