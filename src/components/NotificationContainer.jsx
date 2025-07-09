// src/components/NotificationContainer.jsx
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNotification } from '../contexts/NotificationContext';
import Notification from './Notification';

function NotificationContainer() {
    const { notifications } = useNotification();

    // DEBUG: Ghi log mỗi khi container được render lại
    console.log('[DEBUG] Bước 3: NotificationContainer đang render với số thông báo là:', notifications.length);

    return (
        <div className="fixed top-5 left-5 z-50 w-80">
            <TransitionGroup>
                {notifications.map(({ id, message, type }) => {
                    const nodeRef = React.createRef(null);
                    return (
                        <CSSTransition
                            key={id}
                            nodeRef={nodeRef}
                            timeout={500}
                            classNames="toast"
                            unmountOnExit
                        >
                            <Notification ref={nodeRef} id={id} message={message} type={type} />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </div>
    );
}

export default NotificationContainer;