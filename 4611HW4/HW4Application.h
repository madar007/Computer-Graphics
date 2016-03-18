#ifndef __HW4Application_h_
#define __HW4Application_h_

#include "BaseApplication.h"

/**
 * HW4Application is the class you'll be editing to 
 * complete the checkerboard/sphere scene in Part 2
 * of this homework. Like the tutorials your scene
 * implementation goes in HW4Application.cpp's
 * createScene() definition.
 */
class HW4Application : public BaseApplication
{
public:
    HW4Application(void);
    virtual ~HW4Application(void);

protected:
    virtual void createScene(void);
	virtual void createCamera(void);
	virtual bool frameRenderingQueued(const Ogre::FrameEvent& evt);

private:
	bool processUnbufferedInput(const Ogre::FrameEvent& evt);
};

#endif // #ifndef __HW4Application_h_
