import { useEffect, useRef, useState } from "react";
import {
  ColumnDefinition,
  RowComponent,
  TabulatorFull as Tabulator,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import StudentListSelector from "./StudentListSelector";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sGetUserInfo } from "../../store/user/selector";
import { adminMapMultipleStudentIds } from "../../api/admin/apiAdmin";
import toast from "../../utils/toast";
// import ExportStudentsCSV from "./ExportStudentsCSV";

type Student = {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
};

const ImportStudentList = () => {
  const { t } = useTranslation("global");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudent] = useState<RowComponent[]>([]);

  const [isDialogShowed, setIsDialogShowed] = useState<boolean>(false);

  const previewTableRef = useRef(null);

  const ShowDialog = () => {
    setIsDialogShowed(true);
  };

  const HideDialog = () => {
    setIsDialogShowed(false);
    setSelectedStudent([]);
  };

  const deleteSelectedRows = () => {
    for (const row of selectedStudents) {
      row.delete();
    }

    // Clear selected rows
    setSelectedStudent([]);
  };

  const ConfirmImport = async () => {
    if (students && students.length > 0) {
      console.log(students);
      adminMapMultipleStudentIds(
        students.map((item) => {
          return {
            adminId: user?.id ?? 0,
            code: item.studentId,
            emailAddress: item.email,
          };
        })
      )
        .then(() => {
          toast.success(t("updateStudentIdSuccessfully"));
        })
        .catch((error) => {
          toast.error(error.detail.message);
        });
    }

    //hande import data
    setIsDialogShowed(false);
  };

  const user = useSelector(sGetUserInfo);

  useEffect(() => {
    if (students.length > 0 && previewTableRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const columnDefinitions: ColumnDefinition[] = [
        {
          title: "",
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          hozAlign: "center",
          headerHozAlign: "center",
          headerSort: false,
          width: 40,
        },
        { title: "Id", field: "studentId", editable: true, editor: "input" },
        { title: "Email", field: "email", editable: true, editor: "input" },
        {
          title: "First Name",
          field: "firstName",
          editable: true,
          editor: "input",
        },
        {
          title: "Last Name",
          field: "lastName",
          editable: true,
          editor: "input",
        },
      ];

      const table = new Tabulator(previewTableRef.current, {
        data: students,
        layout: "fitDataTable",
        columns: columnDefinitions,
        cellEdited: (cell) => {
          // This function will be called whenever a cell is edited
          console.log("Cell edited:", cell);
          // You can perform your logic here when a cell is edited
        },
      });

      table.on("rowSelectionChanged", function (_data, rows) {
        setSelectedStudent(rows);
      });

      table.on("dataChanged", function (data) {
        setStudents(data);
      });

      // Optional: If you want to perform any cleanup when the component is unmounted
      return () => {
        table.destroy();
      };
    }
  }, [isDialogShowed, students]);

  useEffect(() => {
    if (students.length > 0) {
      ShowDialog();
    }
  }, [students]);

  return (
    <div>
      <StudentListSelector onChange={(_data) => setStudents(_data)} />

      <Dialog
        sx={{
          display: isDialogShowed ? "block" : "none",
          Width: "auto",
          height: "auto",
        }}
        open={true}
        onClose={HideDialog}
      >
        <DialogTitle id="alert-dialog-title">
          {t("importConfirmation")}
        </DialogTitle>
        <DialogContent sx={{ p: 0, ml: "24px", mr: "24px" }}>
          <Box
            sx={{ minHeight: "38px", display: "flex", alignItems: "flex-end" }}
          >
            <Typography variant="h6" sx={{ mr: 1, mb: 0 }} gutterBottom>
              {t("students")}
            </Typography>
            {selectedStudents.length > 0 && (
              <Button
                variant="outlined"
                onClick={deleteSelectedRows}
                sx={{ pr: "3px", pl: "3px", pt: 0, pb: 0 }}
              >
                {selectedStudents.length >= 2
                  ? `Delete ${selectedStudents.length} records`
                  : `Delete ${selectedStudents.length} record`}
              </Button>
            )}
          </Box>

          <Box
            ref={previewTableRef}
            sx={{ mt: 1, mb: 1, height: "auto", width: "auto" }}
          ></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={HideDialog}> {t("cancel")}</Button>
          <Button onClick={ConfirmImport}>{t("import")}</Button>
        </DialogActions>
      </Dialog>

      {/* <ExportStudentsCSV students={students} /> */}
    </div>
  );
};

export default ImportStudentList;
