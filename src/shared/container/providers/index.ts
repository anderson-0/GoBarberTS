import { container } from 'tsyringe';
import FakeMailProvider from './MailProvider/fakes/FakeMailProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

container.registerSingleton('StorageProvider', DiskStorageProvider);
container.registerSingleton('MailProvider', FakeMailProvider);
container.registerSingleton<IMailProvider>(
  'MailProvider',
  EtherealMailProvider,
);
