#include "HW4Application.h"

//-------------------------------------------------------------------------------------
HW4Application::HW4Application(void)
{
}
//-------------------------------------------------------------------------------------
HW4Application::~HW4Application(void)
{
}

//-------------------------------------------------------------------------------------

void HW4Application::createCamera(void)
{
	//create camera
	mCamera = mSceneMgr->createCamera("PlayerCam");
	mCamera->setPosition(Ogre::Vector3(800, 800, 1500));
	mCamera->lookAt(Ogre::Vector3(0, 0, 0));
	mCamera->setNearClipDistance(5);

	mCameraMan = new OgreBites::SdkCameraMan(mCamera);
}

void HW4Application::createScene(void)
{
	mSceneMgr->setShadowTechnique(Ogre::SHADOWTYPE_STENCIL_ADDITIVE);

	//sphere 1 yellow plastic
	Ogre::Entity* sphereEntity = mSceneMgr->createEntity("sphere.mesh");
	sphereEntity->setCastShadows(true);
	Ogre::SceneNode* sphereNode = mSceneMgr->getRootSceneNode()->createChildSceneNode("SphereNode");
	sphereNode->setPosition(-120, 100, 120);
	sphereNode->attachObject(sphereEntity);
	sphereEntity->setMaterialName("HW4/Yellow");

	//sphere 2 white plastic
	Ogre::Entity* sphere2 = mSceneMgr->createEntity("sphere.mesh");
	Ogre::SceneNode* sphereNode2 = mSceneMgr->getRootSceneNode()->createChildSceneNode("SphereNode2");
	sphereNode2->setPosition(120, 100, -120);
	sphereNode2->attachObject(sphere2);
	sphere2->setMaterialName("HW4/White");
	sphere2->setCastShadows(true);

	//sphere 3 brass
	Ogre::Entity* sphere3 = mSceneMgr->createEntity("sphere.mesh");
	Ogre::SceneNode* sphereNode3 = mSceneMgr->getRootSceneNode()->createChildSceneNode("SphereNode3");
	sphereNode3->setPosition(240, 100, 480);
	sphereNode3->attachObject(sphere3);
	sphere3->setMaterialName("HW4/Brass");
	sphere3->setCastShadows(true);

	//sphere 4 chrome
	Ogre::Entity* sphere4 = mSceneMgr->createEntity("sphere.mesh");
	Ogre::SceneNode* sphereNode4 = mSceneMgr->getRootSceneNode()->createChildSceneNode("SphereNode4");
	sphereNode4->setPosition(480, 100, 300);
	sphereNode4->attachObject(sphere4);
	sphere4->setMaterialName("HW4/Chrome");
	sphere4->setCastShadows(true);

	Ogre::MeshPtr pMesh = Ogre::MeshManager::getSingleton().load("ogrehead.mesh",
    Ogre::ResourceGroupManager::DEFAULT_RESOURCE_GROUP_NAME,
    Ogre::HardwareBuffer::HBU_DYNAMIC_WRITE_ONLY,
    Ogre::HardwareBuffer::HBU_STATIC_WRITE_ONLY, true, true);
	unsigned short src, dest;
	if (!pMesh->suggestTangentVectorBuildParams(Ogre::VES_TANGENT, src, dest))
	{
		pMesh->buildTangentVectors(Ogre::VES_TANGENT, src, dest);
	}

	//create ogre1 with texture map
	Ogre::Entity* ogre1 = mSceneMgr->createEntity("ogrehead.mesh");
	Ogre::SceneNode* ogreNode1 = mSceneMgr->getRootSceneNode()->createChildSceneNode("OgreNode1");
	ogreNode1->setPosition(-240, 80, -480);
	ogreNode1->yaw(Ogre::Degree(45));
	ogreNode1->setScale(3.5, 3.5, 3.5); 
	ogreNode1->attachObject(ogre1);
	ogre1->setMaterialName("HW4/Dirt");
	ogre1->setCastShadows(true);

	//create ogre2 with bump map
	Ogre::Entity* ogre2 = mSceneMgr->createEntity(pMesh);
	Ogre::SceneNode* ogreNode2 = mSceneMgr->getRootSceneNode()->createChildSceneNode("OgreNode2");
	ogreNode2->setPosition(-480, 80, -300);
	ogreNode2->yaw(Ogre::Degree(45));
	ogreNode2->setScale(3.5, 3.5, 3.5); 
	ogreNode2->attachObject(ogre2);	
	ogre2->setMaterialName("CSCI4611/BumpMapSimple");
	ogre2->setCastShadows(true);

	//create penguin
	Ogre::Entity* penguin = mSceneMgr->createEntity("penguin.mesh");
	Ogre::SceneNode* penguinNode = mSceneMgr->getRootSceneNode()->createChildSceneNode("PenguinNode");
	penguinNode->setPosition(0, 20, 0);
	penguinNode->yaw(Ogre::Degree(45));
	penguinNode->attachObject(penguin);
	penguin->setCastShadows(true);

	//create exponential fog
	Ogre::ColourValue fadeColour(0.9, 0.9, 0.9);
	mWindow->getViewport(0)->setBackgroundColour(fadeColour);
	mSceneMgr->setFog(Ogre::FOG_EXP, fadeColour, 0.00004);

	//create plane
	Ogre::Plane plane(Ogre::Vector3::UNIT_Y, 0);

	Ogre::MeshManager::getSingleton().createPlane(
		"checker",
		Ogre::ResourceGroupManager::DEFAULT_RESOURCE_GROUP_NAME,
		plane, 
		1500, 1500, 20, 20, 
		true, 
		1, 2, 2, 
		Ogre::Vector3::UNIT_Z);

	//make checker board
	Ogre::Entity* groundEntity = mSceneMgr->createEntity("checker");
	mSceneMgr->getRootSceneNode()->createChildSceneNode()->attachObject(groundEntity);
	groundEntity->setCastShadows(false);
	groundEntity->setMaterialName("Examples/Checkerboard");

	//first light
	Ogre::Light* pointLight = mSceneMgr->createLight("PointLight");
	pointLight->setType(Ogre::Light::LT_POINT);
	pointLight->setDiffuseColour(1, 1, 1);
	pointLight->setSpecularColour(1, 1, 1);
	pointLight->setPosition(Ogre::Vector3(0, 900, 900));

	//second light
	Ogre::Light* pointLight2 = mSceneMgr->createLight("PointLight2");
	pointLight2->setType(Ogre::Light::LT_POINT);
	pointLight2->setDiffuseColour(1, 1, 1);
	pointLight2->setSpecularColour(1, 1, 1);
	pointLight2->setPosition(Ogre::Vector3(-800, 530, 0));

	//third light
	Ogre::Light* pointLight3 = mSceneMgr->createLight("PointLight3");
	pointLight3->setType(Ogre::Light::LT_POINT);
	pointLight3->setDiffuseColour(1, 1, 1);
	pointLight3->setSpecularColour(1, 1, 1);
	pointLight3->setPosition(Ogre::Vector3(800, 300, 0));

	//fourth light
	Ogre::Light* pointLight4 = mSceneMgr->createLight("PointLight4");
	pointLight4->setType(Ogre::Light::LT_POINT);
	pointLight4->setDiffuseColour(1, 1, 1);
	pointLight4->setSpecularColour(1, 1, 1);
	pointLight4->setPosition(Ogre::Vector3(0, 850, -900));

	//fifth light
	Ogre::Light* pointLight5 = mSceneMgr->createLight("PointLight5");
	pointLight5->setType(Ogre::Light::LT_POINT);
	pointLight5->setDiffuseColour(1, 1, 1);
	pointLight5->setSpecularColour(1, 1, 1);
	pointLight5->setPosition(Ogre::Vector3(0, 500, -300));
}

bool HW4Application::processUnbufferedInput(const Ogre::FrameEvent& evt)
{
	static bool mouseDownLastFrame = false;
	static Ogre::Real toggleTimer = 0.0;
	static Ogre::Real rotate = .13;
	static Ogre::Real move = 250;

	//keyboard movements for penguin
	Ogre::Vector3 dirVec = Ogre::Vector3::ZERO;
	if (mKeyboard->isKeyDown(OIS::KC_I))
		dirVec.z -= move;
	if (mKeyboard->isKeyDown(OIS::KC_K))
	  dirVec.z += move;
	if (mKeyboard->isKeyDown(OIS::KC_J))
	  dirVec.x += move;
	if (mKeyboard->isKeyDown(OIS::KC_L))
	  dirVec.x -= move;

	mSceneMgr->getSceneNode("PenguinNode")->translate(
	dirVec * evt.timeSinceLastFrame,
	Ogre::Node::TS_LOCAL);

    return true;
}

bool HW4Application::frameRenderingQueued(const Ogre::FrameEvent& evt)
{
    bool ret = BaseApplication::frameRenderingQueued(evt);
	if(!processUnbufferedInput(evt))
		return false;
	
    return ret;
}