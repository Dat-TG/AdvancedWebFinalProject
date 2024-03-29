import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTranslation } from "react-i18next";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";
import { sGetUserInfo } from "../../store/user/selector";
import { getNotifications, markReadNotification } from "../../api/notification/apiNotification";
import { INotification, IToastError, NotificationTypes } from "../../types/common";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../api/user/apiUser";
import { getCourseById } from "../../api/course/apiCourse";


type notificationContent = {
  id: number;
  creatorName: string;
  message: string;
  isRead: boolean;
  link: string;
}

// const seedNotificationDTOList: INotification[] = [
//   {
//     id: 1,
//     creatorId: 101,
//     createdTime: new Date(),
//     requestReviewId: 201,
//     type: "approve",
//     isRead: false,
//   },
//   {
//     id: 2,
//     creatorId: 102,
//     createdTime: new Date(),
//     requestReviewId: 202,
//     type: "reject",
//     isRead: true,
//   },
//   {
//     id: 3,
//     creatorId: 103,
//     createdTime: new Date(),
//     requestReviewId: 203,
//     type: "request_review",
//     isRead: false,
//   },
//   {
//     id: 4,
//     creatorId: 104,
//     createdTime: new Date(),
//     requestReviewId: 204,
//     type: "finalized",
//     isRead: false,
//   },
//   {
//     id: 5,
//     creatorId: 105,
//     createdTime: new Date(),
//     requestReviewId: 205,
//     type: "teacher_comment",
//     isRead: false,
//   },
//   {
//     id: 6,
//     creatorId: 106,
//     createdTime: new Date(),
//     requestReviewId: 206,
//     type: "student_comment",
//     isRead: false,
//   },
// ];

const NotificationsList: React.FC = () => {
  const userId = useSelector(sGetUserInfo)?.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationDTOList, setNotificationDTOList] = useState<INotification[]>([]);
  const [notificationContentList, setNotificationContentList] = useState<notificationContent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(userId);
    if (userId !== undefined) {
      //setNotificationDTOList(seedNotificationDTOList);
      getNotifications().then((res) => {
        const notifications = res.notifications as INotification[];
        console.log(notifications);

        setNotificationDTOList(notifications);
        console.log("notifications: ", notificationDTOList);
      }).catch((error: IToastError) => { console.log(error.detail.message) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const newUnreadCount = notificationContentList.filter(
      notification => !notification.isRead
    ).length;

    setUnreadCount(newUnreadCount);
    console.log(newUnreadCount);
  }, [notificationContentList]);

  async function convertNotification(dto: INotification): Promise<notificationContent> {
    const notification: notificationContent = {
      id: -1,
      creatorName: "",
      message: "",
      isRead: false,
      link: ""
    };

    try {
      const creator = await getUserById(dto.createdBy);
      const senderName = creator.name + ' ' + creator.surname;


      notification.id = dto.id;

      notification.creatorName = senderName;
      console.log("dto", dto);

      const getCourseCode = async () => {
        try {
          let courseId;

          if (dto.type == NotificationTypes.finalized || dto.type == NotificationTypes.studentComment || dto.type == NotificationTypes.teacherComment) {
            console.log("Id của lớp học kiểu bên ngoài",dto.courseId);
            courseId = dto.courseId;
          } else {
            console.log("Id của lớp học bên trong",dto.courseId);
            courseId = dto.requestReview.courseId;
          }

          const res = await getCourseById(courseId);
          const courseCode = res.data.code as string;

          return courseCode;
        } catch (error) {
          console.error('Error fetching course code:', error);

          return null;
        }
      };

      // Gọi hàm getCourseCode khi cần
      const courseCode = await getCourseCode();

      if (dto.type === NotificationTypes.finalized) {
        notification.message = t('finalizedCompositionNotification');
        notification.link = "/class/" + courseCode + "/grades";
      }
      else if (dto.type === NotificationTypes.approve) {
        notification.message = t('approveReviewRequesNotification');
        const requestReview = dto.requestReview.id;
        notification.link = `class/${courseCode}/grades/request/${requestReview}`;
      }
      else if (dto.type === NotificationTypes.reject) {
        notification.message = t('rejectReviewRequesNotification');
        const requestReview = dto.requestReview.id;
        notification.link = `class/${courseCode}/grades/request/${requestReview}`;
      }
      else if (dto.type === NotificationTypes.requestReview) {
        notification.message = t('reviewRequestNotification');
        const requestReview = dto.requestReview.id;
        notification.link = `class/${courseCode}/grades/request/${requestReview}`;
      }
      else if (dto.type === NotificationTypes.teacherComment) {
        notification.message = t('teacherCommentNotification');
        const requestReview = dto.commentRequest.requestReviewId;
        notification.link = `class/${courseCode}/grades/request/${requestReview}`;
      }
      else if (dto.type === NotificationTypes.studentComment) {
        notification.message = t('studentCommentNotification');
        const requestReview = dto.commentRequest.requestReviewId;
        notification.link = `class/${courseCode}/grades/request/${requestReview}`;
      }

      notification.isRead = dto.isRead;

    } catch (error) {
      console.error('Error converting notification:', error);
    }

    return notification;
  }

  useEffect(() => {
    const convertNotifications = async () => {
      try {
        const convertedList: notificationContent[] = await Promise.all(
          notificationDTOList.map(async (dto) => await convertNotification(dto))
        );
        setNotificationContentList(convertedList);
      } catch (error) {
        console.error('Error converting notifications:', error);
      }
    };

    convertNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationDTOList]);



  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [t] = useTranslation("global");

  const viewNotification = async (notification: notificationContent) => {

    try {
      if (!notification.isRead) {
        await markReadNotification(notification.id);
        const updatedNotificationList = [...notificationContentList];

        const index = updatedNotificationList.findIndex(item => item.id === notification.id);
        if (index !== -1) {
          updatedNotificationList[index].isRead = true;
        }

        setNotificationContentList(updatedNotificationList);
      }
      handleClose();
        navigate(notification.link);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    console.log(notification.link);
  }


  const markAllAsRead = async () => {
    try {
      const updatedList = notificationContentList.map(notification => {
        if (!notification.isRead) {
          markReadNotification(notification.id);
          return { ...notification, isRead: true };
        }
        return notification;
      });

      setNotificationContentList(updatedList);
      handleClose();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }


  return (
    <div>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: "40px",
          height: "40px", // Set button size
        }}
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}

      >
        <Box
          sx={{
            display: "flex",
            justifyContent: notificationContentList.length > 0 ? "space-between" : "start",
            width: "100%",
            mb: 1
          }}
        >
          <Typography variant="h6" sx={{ ml: 2 }}> {t("notifications")}</Typography>

          {
            notificationContentList.length > 0 &&
            (<Button variant="text" sx={{ ml: 1 }} onClick={markAllAsRead}>
              {t("markAllAsRead")}
            </Button>)
          }

        </Box>

        {notificationContentList.length > 0 ?
          (<Box sx={{ height: "500px" }}>
            {notificationContentList.map((notification, index) => (
              <MenuItem
                key={index}
                sx={{
                  borderBottom: 'solid 1px darkGray'
                }}
                onClick={() => viewNotification(notification)}
              >
                <Grid container spacing={1} sx={{ display: "flex" }}>
                  <Grid item xs={11}>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "normal",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        maxHeight: "4rem",
                        WebkitLineClamp: 2,
                        color: notification.isRead ? '#4d4d4d' : 'black',
                        width: '275px'

                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{notification.creatorName}</span> {notification.message}
                    </Typography>
                  </Grid>

                  <Grid item xs={1} sx={{
                    width: "25px",
                    display: "flex",
                    alignItems: "center",
                  }}>

                    {
                      !notification.isRead &&
                      <CircleIcon sx={{ fontSize: "small", color: "primary" }} />
                    }

                  </Grid>

                </Grid>
              </MenuItem>
            ))}
          </Box>) :
          (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '250px',
              height: '200px'
            }}>
              {t("noNotifications")}
            </Box>
          )
        }


      </Menu>
    </div>
  );
};

export default NotificationsList;
