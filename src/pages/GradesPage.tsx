import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { IGetCoursesRes } from "../types/course";
// import { IUserProfileRes } from "../types/user";
// import { getUserById } from "../api/user/apiUser";

import { RowComponent, TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { Button, Typography } from "@mui/material";

interface Props {
  colorTheme: string;
  classEntity: IGetCoursesRes;
  teacherIds: number[];
  studentIds: number[];
  ownerId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function GradesPage(_props: Props) {
  const gradeTableRef = useRef(null);
  const gradeScaleTableRef = useRef(null);
  const { t } = useTranslation("global");
  // const [teachers, setTeachers] = useState<IUserProfileRes[] | null>(null);
  // const [students, setStudents] = useState<IUserProfileRes[] | null>(null);
  // const [owner, setOwner] = useState<IUserProfileRes | null>(null);
  const [gradeScaleTable, setGradeScaleTable] = useState<Tabulator | null>(
    null
  );
  const [gradesTable, setGradesTable] = useState<Tabulator | null>(null);

  const [selectedGradeScale, setSelectedGradeScale] = useState<RowComponent[]>(
    []
  );
  const [selectedStudent, setSelectedStudent] = useState<RowComponent[]>([]);

  const [gradeScale, setGradeScale] = useState([
    {
      name: "Midterm",
      scale: 0.3,
    },
    {
      name: "Final",
      scale: 0.7,
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [grades, setGrades] = useState<any[]>([
    {
      studentId: "20120454",
      firstName: "Đắt",
      lastName: "Lê Công",
      Midterm: 10,
      Final: 10,
      average: 10,
    },
    {
      studentId: "20120455",
      firstName: "Hoa",
      lastName: "Nguyễn Thị",
      Midterm: 9,
      Final: 8,
      average: 8.5,
    },
    {
      studentId: "20120456",
      firstName: "Tuấn",
      lastName: "Trần Văn",
      Midterm: 7,
      Final: 6,
      average: 6.5,
    },
    {
      studentId: "20120457",
      firstName: "Hằng",
      lastName: "Phạm Thị",
      Midterm: 5,
      Final: 4,
      average: 4.5,
    },
    {
      studentId: "20120458",
      firstName: "Minh",
      lastName: "Vũ Minh",
      Midterm: 8,
      Final: 9,
      average: 8.5,
    },
    {
      studentId: "20120459",
      firstName: "Nam",
      lastName: "Hoàng Văn",
      Midterm: 6,
      Final: 7,
      average: 6.5,
    },
    {
      studentId: "20120460",
      firstName: "Thảo",
      lastName: "Đặng Thị",
      Midterm: 9,
      Final: 9,
      average: 9,
    },
    {
      studentId: "20120461",
      firstName: "Long",
      lastName: "Nguyễn Văn",
      Midterm: 7,
      Final: 8,
      average: 7.5,
    },
    {
      studentId: "20120462",
      firstName: "Linh",
      lastName: "Trần Thị",
      Midterm: 8,
      Final: 6,
      average: 7,
    },
    {
      studentId: "20120463",
      firstName: "Hoàng",
      lastName: "Lê Văn",
      Midterm: 9,
      Final: 10,
      average: 9.5,
    },
  ]);

  useEffect(() => {
    let gradeTable: Tabulator;
    let gradeScaleTable: Tabulator;
    if (gradeTableRef && gradeTableRef.current) {
      // Initialize Tabulator
      gradeTable = new Tabulator(gradeTableRef.current, {
        movableRows: true,
        movableColumns: true,
        data: grades,
        layout: "fitDataTable",
        history: true,
        cellEdited: (cell) => {
          // This function will be called whenever a cell is edited
          console.log("Cell edited:", cell);
          // You can perform your logic here when a cell is edited
        },
        columns: [
          {
            title: "",
            rowHandle: true,
            formatter: "handle",
            headerSort: false,
            frozen: true,
          },
          {
            title: "",
            formatter: "rowSelection",
            titleFormatter: "rowSelection",
            hozAlign: "center",
            vertAlign: "middle",
            headerHozAlign: "center",
            headerSort: false,
          },
          {
            title: "Student ID",
            field: "studentId",
            editable: true,
            editor: "input",
          },
          {
            title: "First name",
            field: "firstName",
            editable: true,
            editor: "input",
          },
          {
            title: "Last name",
            field: "lastName",
            editable: true,
            editor: "input",
          },
          {
            title: "Midterm",
            field: "Midterm",
            editable: true,
            editor: "number",
            sorter: "number",
          },
          {
            title: "Final",
            field: "Final",
            editable: true,
            editor: "number",
            sorter: "number",
          },
          {
            title: "Average",
            field: "average",
            editable: true,
            editor: "number",
            sorter: "number",
          },
        ],
      });

      setGradesTable(gradeTable);

      //listen for row move
      gradeTable.on("rowMoved", function (row) {
        console.log("Row: " + row.getData().studentId + " has been moved");
      });
      gradeTable.on("rowSelectionChanged", function (_data, rows) {
        //rows - array of row components for the currently selected rows in order of selection
        //data - array of data objects for the currently selected rows in order of selection
        //selected - array of row components that were selected in the last action
        //deselected - array of row components that were deselected in the last action
        setSelectedStudent(rows);
      });
    }

    if (gradeScaleTableRef && gradeScaleTableRef.current) {
      // Initialize Tabulator
      gradeScaleTable = new Tabulator(gradeScaleTableRef.current, {
        movableRows: true,
        history: true,
        movableColumns: true,
        data: gradeScale,
        layout: "fitDataTable",
        cellEdited: (cell) => {
          // This function will be called whenever a cell is edited
          console.log("Cell edited:", cell);
          // You can perform your logic here when a cell is edited
        },
        columns: [
          {
            title: "",
            rowHandle: true,
            formatter: "handle",
            headerSort: false,
            frozen: true,
          },
          {
            title: "",
            formatter: "rowSelection",
            titleFormatter: "rowSelection",
            hozAlign: "center",
            vertAlign: "middle",
            headerHozAlign: "center",
            headerSort: false,
          },
          {
            title: "Name",
            field: "name",
            editable: true,
            editor: "input",
          },
          {
            title: "Scale",
            field: "scale",
            editable: true,
            editor: "number",
            editorParams: {
              min: 0,
              step: 0.1,
            },
            sorter: "number",
          },
        ],
      });
      setGradeScaleTable(gradeScaleTable);
      //listen for row move
      gradeScaleTable.on("rowMoved", function (row) {
        console.log("Row: " + row.getData().name + " has been moved");
      });
      gradeScaleTable.on("rowSelectionChanged", function (_data, rows) {
        //rows - array of row components for the currently selected rows in order of selection
        //data - array of data objects for the currently selected rows in order of selection
        //selected - array of row components that were selected in the last action
        //deselected - array of row components that were deselected in the last action
        setSelectedGradeScale(rows);
      });
      gradeScaleTable.on("cellEdited", function (cell) {
        //cell - cell component
        console.log(
          "Cell edited:",
          cell.getField(),
          cell.getValue(),
          cell.getOldValue()
        );
        setGradeScale((prev) => {
          let isExist = false;
          prev.forEach((gradeScale) => {
            if (gradeScale.name === cell.getOldValue()) {
              gradeScale.name = cell.getValue();
              isExist = true;
              return true;
            }
          });
          if (!isExist) {
            prev.push({
              name: cell.getRow().getData().name,
              scale: cell.getRow().getData().scale,
            });
          }
          return prev;
        });
        if (cell.getField() === "name") {
          let isExist = false;
          gradeTable.setColumns(
            gradeTable.getColumnDefinitions().map((col) => {
              if (col.field === cell.getOldValue() && col.field != undefined) {
                col.title = cell.getValue();
                col.field = cell.getValue();
                isExist = true;
              }
              return col;
            })
          );
          console.log("isExist", isExist);
          if (!isExist) {
            gradeTable.addColumn(
              {
                title: cell.getValue(),
                field: cell.getValue(),
                editable: true,
                editor: "number",
                sorter: "number",
              },
              true,
              "average"
            );
          }
          setGrades((prev) => {
            prev.forEach((grade) => {
              grade[cell.getValue()] = grade[cell.getOldValue()];
              delete grade[cell.getOldValue()];
            });
            gradeTable.setData(prev);
            return prev;
          });
        }
      });
    }

    // Cleanup when component unmounts
    return () => {
      gradeScaleTable.destroy();
      gradeTable.destroy();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   getUserById(props.ownerId)
  //     .then((res) => {
  //       setOwner(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   for (let i = 0; i < props.teacherIds.length; i++) {
  //     getUserById(props.teacherIds[i])
  //       .then((res) => {
  //         setTeachers((prev) => {
  //           if (prev == null) return [res];
  //           return [...prev, res];
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   for (let i = 0; i < props.studentIds.length; i++) {
  //     getUserById(props.studentIds[i])
  //       .then((res) => {
  //         setStudents((prev) => {
  //           if (prev == null) return [res];
  //           return [...prev, res];
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [props.ownerId, props.studentIds, props.teacherIds]);

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography variant={"h5"}>{t("gradeScaleTable")}</Typography>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradeScaleTable?.addRow({});
          }}
        >
          {t("addGradeScale")}
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradeScaleTable?.undo();
          }}
        >
          {t("undo")}
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradeScaleTable?.redo();
          }}
        >
          {t("redo")}
        </Button>
      </div>
      {selectedGradeScale.length > 0 && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              if (
                window.confirm(
                  `${t("deleteRowAlert")} ${selectedGradeScale.length} ${t(
                    "gradeScale"
                  )}?`
                )
              ) {
                for (let i = 0; i < selectedGradeScale.length; i++) {
                  selectedGradeScale[i].delete();
                  gradesTable?.deleteColumn(
                    selectedGradeScale[i].getData().name
                  );
                }
                setSelectedGradeScale([]);
              }
            }}
          >
            {`${t("delete")} ${selectedGradeScale.length} ${t("gradeScale")}`}
          </Button>
        </div>
      )}
      <div ref={gradeScaleTableRef} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          marginBottom: "16px",
          marginTop: "16px",
        }}
      >
        <Typography variant={"h5"}>{t("gradesTable")}</Typography>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradesTable?.addRow({});
          }}
        >
          {t("addStudent")}
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradesTable?.undo();
          }}
        >
          {t("undo")}
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            padding: "8px",
          }}
          onClick={() => {
            gradesTable?.redo();
          }}
        >
          {t("redo")}
        </Button>
      </div>
      {selectedStudent.length > 0 && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              if (
                window.confirm(
                  `${t("deleteRowAlert")} ${selectedStudent.length} ${t(
                    "student"
                  )}?`
                )
              ) {
                for (let i = 0; i < selectedStudent.length; i++) {
                  selectedStudent[i].delete();
                }
                setSelectedStudent([]);
              }
            }}
          >
            {`${t("delete")} ${selectedStudent.length} ${t("student")}`}
          </Button>
        </div>
      )}
      <div ref={gradeTableRef} />
    </div>
  );
}
