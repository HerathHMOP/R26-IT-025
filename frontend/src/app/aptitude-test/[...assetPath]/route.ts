import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const CURSOR_ACTIVITY_1_ASSETS: Record<string, string> = {
  "sinhala/grade-2/images/activity1-kettle.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_kettle-c678e05b-15cc-491d-b0d7-3b06f5a47c23.png",
  "sinhala/grade-2/images/activity1-chair.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_chair-9c954a9a-4efa-4986-88e0-da6802da7c2d.png",
  "sinhala/grade-2/images/activity1-axe.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_axe-5d4d10e7-b0a6-485f-ace4-2bc449ed4a11.png",
  "sinhala/grade-2/images/activity1-necklace.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_img1-necklace-8aa12328-bcc6-4c74-991c-508d3b7466c6.png",
  "sinhala/grade-2/images/activity1-elephant.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_elephant-5b25013a-c361-4324-adfc-e25f1698cf3d.png",
  "general/pre/images/Activity 01/cherries.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.25_PM__1_-5f70e3e6-7d29-44d1-a9f9-373d74ae7d82.png",
  "general/pre/images/Activity 01/mangoes.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.25_PM__3_-9cb283f6-c759-4282-a4e3-196e5cac92a5.png",
  "general/pre/images/Activity 01/avocados.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.25_PM__2_-1b518e69-9d48-4496-af0d-a73d797b01c5.png",
  "general/pre/images/Activity 01/oranges.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.25_PM__4_-d2d980cd-f68c-45d0-b1c2-500adcd65ec4.png",
  "general/pre/images/Activity 01/banana.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.25_PM-fda3a115-eb3c-4048-9989-aed29cd996ba.png",
  "general/pre/images/Activity-2/orange.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.35_PM__1_-e7b38115-297e-4bb1-9ba8-906135f2732b.png",
  "general/pre/images/Activity-2/ball.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.35_PM__2_-a8cec7e2-97e0-43c1-ab67-06dff0fe08c3.png",
  "general/pre/images/Activity-2/icecream.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.36_PM-47c5190b-671d-494b-88ff-d8a749b5d473.png",
  "general/pre/images/Activity-2/bat.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.35_PM__3_-6fea9e94-7aca-4304-a08c-742aa71b7b8b.png",
  "general/pre/images/Activity-2/girl.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_WhatsApp_Image_2026-05-05_at_5.09.36_PM__1_-39c0303d-893d-4e12-ac7b-006fe7283cb8.png",
  "general/pre/images/Activity-5/cow-mother.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_cow-mother-18aa776e-ee24-4bd9-9656-4dcc7443f5d5.png",
  "general/pre/images/Activity-5/pig-mother.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_pig-mother-a5b4c899-05e4-4eec-aaf0-276a9eba5d81.png",
  "general/pre/images/Activity-5/giraffe-baby.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_giraffe-baby-ed41ac28-2814-4d36-b3bc-05ba37e92054.png",
  "general/pre/images/Activity-5/elephant-mother.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_elephant-mother-41c2e1ec-f7f2-4a0a-b4f8-2f6ddff1db2f.png",
  "general/pre/images/Activity-5/giraffe-mother.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_giraffe-mother-60439890-599d-4175-a0cc-047576135cc2.png",
  "general/pre/images/Activity-5/pig-baby.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_pig-baby-ffb61084-b3d7-42c0-b035-26e13693d4a5.png",
  "general/pre/images/Activity-5/elephant-baby.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_elephant-baby-69c09f1b-f717-4527-a308-641b9ccb180a.png",
  "general/pre/images/Activity-5/cow-baby.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_cow-baby-dd42e9ca-ca13-4761-859b-a4bd635836cb.png",
  "general/pre/images/Activity-5/mother-cow.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_cow-mother-18aa776e-ee24-4bd9-9656-4dcc7443f5d5.png",
  "general/pre/images/Activity-5/mother-pig.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_pig-mother-a5b4c899-05e4-4eec-aaf0-276a9eba5d81.png",
  "general/pre/images/Activity-5/mother-elephant.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_elephant-mother-41c2e1ec-f7f2-4a0a-b4f8-2f6ddff1db2f.png",
  "general/pre/images/Activity-5/mother-giraffe.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_giraffe-mother-60439890-599d-4175-a0cc-047576135cc2.png",
  "general/pre/images/Activity-5/baby-cow.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_cow-baby-dd42e9ca-ca13-4761-859b-a4bd635836cb.png",
  "general/pre/images/Activity-5/baby-pig.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_pig-baby-ffb61084-b3d7-42c0-b035-26e13693d4a5.png",
  "general/pre/images/Activity-5/baby-elephant.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_elephant-baby-69c09f1b-f717-4527-a308-641b9ccb180a.png",
  "general/pre/images/Activity-5/baby-giraffe.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_giraffe-baby-ed41ac28-2814-4d36-b3bc-05ba37e92054.png",
  "general/pre/images/Activity 07/black-car.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_black-car-0c5c576b-652e-4044-8984-b52d979f81f9.png",
  "general/pre/images/Activity 07/red-car.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_red-car-3db4d1e7-c328-4419-aabb-de7fde71b05a.png",
  "general/pre/images/Activity 07/blue-car.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_blue-car-a5452d83-4296-4322-9cbf-b398e1a7fbc4.png",
  "general/pre/images/Activity 07/blue-tyre.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_blue-tyre-71088060-55aa-4127-8e83-bfc769a3f4f5.png",
  "general/pre/images/Activity 07/red-tyre.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_red-tyre-165f57a3-4e1d-4ede-8493-83fb2ac961d1.png",
  "general/pre/images/Activity 07/yellow-tyre.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_yellow-tyre-8108425a-a70c-408c-a044-3fb15552b6f6.png",
  "general/pre/images/Activity 07/yellow-car.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_yellow-car-30856c4e-53a3-4be2-a4f2-baeed7ce36ae.png",
  "general/pre/images/Activity 07/black-tyre.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_black-tyre-f361f683-84f4-4556-94d1-18cbd9865fc9.png",
  "general/pre/images/Activity-15/butterfly.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_butterfly-c02a5018-847a-4e82-b494-c7b0aa9ffa46.png",
  "general/pre/images/Activity-15/mango.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_mango-92edf93e-f4f2-407d-8f57-dfa66c081980.png",
  "general/pre/images/Activity-15/cow.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_cow-83f4dd1b-a8b1-4ca3-9961-884140a3d508.png",
  "general/pre/images/Activity-15/dog.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_dog-d8e5c6e9-83ca-4072-8b31-21587b5a4250.png",
  "general/pre/images/Activity-15/parrot.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_parrot-fe04eeb6-aff0-4b66-a662-23f4323a50fe.png",
  "general/pre/images/Activity-15/flower.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_flower-95c58fdc-e210-4984-94ee-a9908631bd37.png",
  "general/pre/images/Activity-15/meat.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_meat-1f4239e3-fd7e-437b-aa3d-721da6eb6af6.png",
  "general/pre/images/Activity-15/grass.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_grass-5f84b6b2-167a-4575-b4c6-821b6fcf3ff3.png",
  "general/pre/images/Activity-11/bee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_bee-bfbe935e-aa3b-483d-afd6-bb0beecfed97.png",
  "general/pre/images/Activity-11/lion.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_lion-20644abe-4160-4150-b7ed-824dfcb24b58.png",
  "general/pre/images/Activity-11/dog-home.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_dog-home-fd485762-2755-46fc-93b5-14f2129ce789.png",
  "general/pre/images/Activity-11/bee-home.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_bee-home-45bdb5d4-a046-4471-bdde-3d6fcc91b12c.png",
  "general/pre/images/Activity-11/lion-home.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_lion-home-c8d6f7b2-76a4-4cf8-aa92-5d3707917f1b.png",
  "general/pre/images/Activity-11/dog.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_dog-e1acd8b8-4dc1-4b78-869f-4ceab9519ef5.png",
  "general/pre/images/Activity-10/triangle-shape.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_triangle-shape-178b320e-95f7-4eae-b03e-f02d42ee60cc.png",
  "general/pre/images/Activity-10/rectangle-shape.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_rectangle-shape-216a1b4f-4581-40fa-a694-f7e63d407eee.png",
  "general/pre/images/Activity-10/circle-shape.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_circle-shape-30a50f03-d263-49bc-96e5-c3b95e4c245a.png",
  "general/pre/images/Activity-10/squre-shape.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_squre-shape-1a875c0a-89b1-46a1-8061-1991425def54.png",
  "general/pre/images/Activity 09/fruit-1.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_fruit-1-83e3af15-1fb8-4028-a592-7210ecda4940.png",
  "general/pre/images/Activity 09/fruit-2.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_fruit-2-acb6df36-ec40-498c-b1eb-f859b6c76eca.png",
  "general/pre/images/Activity 09/fruit-3.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_fruit-3-014730c9-27db-44e0-baa4-320bc32e5a80.png",
  "general/pre/images/Activity 09/fruit-4.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_fruit-4-067dae65-15b6-4215-92c8-359aa68ec1eb.png",
  "general/pre/images/Activity 09/vegitable-1.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_vegitable-1-ac0bb7fe-42c7-4667-a8a3-eb9633c10014.png",
  "general/pre/images/Activity 09/vegitable-2.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_vegitable-2-854dfae9-8257-4f3a-8bb3-a8a7034323cd.png",
  "general/pre/images/Activity 09/vegitable-3.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_vegitable-3-ec3cab45-d814-4ac7-8ee3-c520b082b540.png",
  "general/pre/images/Activity 09/vegitable-4.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_vegitable-4-93acb47c-2ac4-4cee-ad1b-013520b8e5f5.png",
  "maths/grade-3/Images/1-dog.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_1-dog-a1fc20a5-2334-4f4c-a955-9bbb44a54818.png",
  "maths/grade-3/Images/4-cats.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_4-cats-4366cd9c-026a-4862-8f75-7fe7d8e1c97c.png",
  "maths/grade-3/Images/6-parrot.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_6-parrot-44bd4e3c-4f1b-40b7-86e2-b2721d1ba353.png",
  "maths/grade-3/Images/2-cows.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_2-cows-03a2c37f-2022-4a4b-8a6b-f31927270e81.png",
  "maths/grade-3/Images/3-fishes.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_3-fishes-288d57f9-bd94-4226-8e79-5aa57dc1992f.png",
  "maths/grade-3/Images/grand-farther.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_grand-farther-7d68d285-3d9f-4fa2-af7a-31cdf3ad05e2.png",
  "maths/grade-3/Images/farther.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_farther-926f4b6e-4f26-40d4-9b7f-da1370e96462.png",
  "maths/grade-3/Images/son.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_son-26235ce4-028f-4f74-a01a-2dcd6b7defd0.png",
  "maths/grade-3/Images/daughter.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_daughter-9d2310c6-34c3-431c-a161-c8f6892ea7ff.png",
  "maths/grade-3/Images/grand-mother.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_grand-mother-1cb1b0d7-3e87-42aa-923e-faa27968462d.png",
  "maths/grade-3/Images/night.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_night-93432bc1-b5d4-4c38-89bc-e2af95ea80f2.png",
  "maths/grade-3/Images/evening.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_evening-08770102-4e50-4925-867d-301f26068c7e.png",
  "maths/grade-3/Images/afternoon.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_afternoon-230e7b95-81a9-4db4-b153-2a898bb5729e.png",
  "maths/grade-3/Images/morning.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_morning-464984bf-53f3-44b4-afa7-6d95cf90073e.png",
  "maths/grade-3/Images/6-clock.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_6-clock-5db8dafe-79bf-487d-9ed0-768fc8fc304e.png",
  "maths/grade-3/Images/3-clock.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_3-clock-f5ff6ab0-e8e2-4b20-989f-4d6a0367a078.png",
  "maths/grade-3/Images/9-clock.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_9-clock-8e81f932-94b3-42eb-b560-c906dae70b7d.png",
  "maths/grade-3/Images/12-clock.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_12-clock-d6986b6b-c50b-4055-a5a0-3f8747c26c28.png",
  "maths/grade-3/Images/2-rupee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_2-rupee-a9e531dc-2900-4b74-a492-13d2c7cb4f80.png",
  "maths/grade-3/Images/20-rupee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_20-rupee-15a84aae-d8df-4b4a-876f-0c3efb03c65b.png",
  "maths/grade-3/Images/10-rupee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_10-rupee-ea5b1bfa-e230-46ee-9356-9787647f0548.png",
  "maths/grade-3/Images/100-rupee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_100-rupee-24a1db5d-7771-47b3-a4ac-304bf189dc2c.png",
  "maths/grade-3/Images/500-rupee.png":
    "c__Users_lpwcr_AppData_Roaming_Cursor_User_workspaceStorage_3b50cd68e66c79a5e5d061a2fcbb93cd_images_500-rupee-75bb528a-316f-4949-ac4e-80959e93a89d.png"
};

async function readFromFallbackAsset(relativePath: string) {
  const fallbackFile = CURSOR_ACTIVITY_1_ASSETS[relativePath];
  if (!fallbackFile) return null;
  const assetPath = path.join(
    os.homedir(),
    ".cursor",
    "projects",
    "d-Software-laragon-www-modern-lms",
    "assets",
    fallbackFile
  );
  const bytes = await readFile(assetPath);
  return { bytes, sourcePath: assetPath };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetPath: string[] }> }
) {
  const resolvedParams = await params;
  const rawParts = resolvedParams.assetPath || [];
  const safeParts = rawParts.filter((part) => part && part !== "." && part !== "..");
  if (safeParts.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const relativePath = safeParts.join("/");
  const projectRoot = path.resolve(process.cwd(), "..");
  const sourcePath = path.resolve(projectRoot, "aptitude-test", ...safeParts);
  const expectedBase = path.resolve(projectRoot, "aptitude-test");

  if (!sourcePath.startsWith(expectedBase)) {
    return new Response("Invalid path", { status: 400 });
  }

  let bytes: Buffer;
  let resolvedPath = sourcePath;
  try {
    bytes = await readFile(sourcePath);
  } catch {
    const fallback = await readFromFallbackAsset(relativePath);
    if (!fallback) {
      return new Response("Not found", { status: 404 });
    }
    bytes = fallback.bytes;
    resolvedPath = fallback.sourcePath;
  }

  try {
    const extension = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
