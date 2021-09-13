import { describe, test, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";

import Routes from "../../src/routes.js";

describe("#FileHelper", () => {
  describe("#getFileStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const statMock = {
        dev: 2056,
        mode: 33204,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 17493855,
        size: 399995,
        blocks: 784,
        atimeMs: 1631191463902.2915,
        mtimeMs: 1631191460258.329,
        ctimeMs: 1631191460258.329,
        birthtimeMs: 1631191460234.3293,
        atime: "2021-09-09T12:44:23.902Z",
        mtime: "2021-09-09T12:44:20.258Z",
        ctime: "2021-09-09T12:44:20.258Z",
        birthtime: "2021-09-09T12:44:20.234Z",
      };

      const mockUser = "diego-mg";
      process.env.USER = mockUser;
      const filename = "file.png";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);

      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus("/tmp");
      const expectedResult = [
        {
          size: "400 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
